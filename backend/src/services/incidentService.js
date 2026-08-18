const { randomUUID } = require("crypto");
const { query, getClient } = require("../db/pool");
const { mapIncident, mapResponder } = require("../db/mappers");
const {
  emitNewIncident,
  emitUpdatedIncident,
} = require("../sockets/handlers/incidentHandler");

const normalizeLocation = (location) => {
  if (!location) return { zone: null, lat: null, lng: null };
  if (typeof location === "string") {
    return { zone: location, lat: null, lng: null };
  }
  return {
    zone: location.zone || null,
    lat: location.lat ?? null,
    lng: location.lng ?? null,
  };
};

const ensureCameraExists = async (cameraId, zone) => {
  await query(
    `INSERT INTO cameras (id, zone, lat, lng)
     VALUES ($1, $2, NULL, NULL)
     ON CONFLICT (id) DO NOTHING`,
    [cameraId, zone || "Unknown"]
  );
};

const createIncident = async (data) => {
  const { type, cameraId, confidence, location } = data;
  if (!type || !cameraId || !location) {
    throw new Error("type, cameraId and location are required");
  }

  const loc = normalizeLocation(location);
  await ensureCameraExists(cameraId, loc.zone);

  const id = randomUUID();
  const insert = await query(
    `INSERT INTO incidents (
       id, type, camera_id, confidence, zone, lat, lng, status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'detected')
     RETURNING *`,
    [
      id,
      type,
      cameraId,
      confidence ?? null,
      loc.zone,
      loc.lat,
      loc.lng,
    ]
  );

  let incident = mapIncident(insert.rows[0]);
  emitNewIncident(incident);

  const responder = await assignResponderToIncident(incident);
  if (responder) {
    const refreshed = await query(`SELECT * FROM incidents WHERE id = $1`, [
      incident.id,
    ]);
    incident = mapIncident(refreshed.rows[0]);
    emitUpdatedIncident(incident);
  }

  return incident;
};

const assignResponderToIncident = async (incident) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const available = await client.query(
      `SELECT * FROM responders
       WHERE status = 'available'
       ORDER BY created_at ASC
       LIMIT 1
       FOR UPDATE SKIP LOCKED`
    );

    if (available.rows.length === 0) {
      await client.query("COMMIT");
      return null;
    }

    const responderRow = available.rows[0];

    await client.query(
      `UPDATE responders
       SET status = 'assigned',
           assigned_incident_id = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [incident.id, responderRow.id]
    );

    await client.query(
      `UPDATE incidents
       SET status = 'dispatched',
           assigned_responder_id = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [responderRow.id, incident.id]
    );

    await client.query("COMMIT");
    return mapResponder({
      ...responderRow,
      status: "assigned",
      assigned_incident_id: incident.id,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getIncidentById = async (id) => {
  const result = await query(`SELECT * FROM incidents WHERE id = $1`, [id]);
  return mapIncident(result.rows[0]);
};

const verifyIncident = async (id) => {
  const result = await query(
    `UPDATE incidents
     SET status = 'verified',
         verified_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Incident not found");
  }

  const incident = mapIncident(result.rows[0]);
  emitUpdatedIncident(incident);
  return incident;
};

const resolveIncident = async (id) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE incidents
       SET status = 'resolved',
           resolved_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      throw new Error("Incident not found");
    }

    const incidentRow = result.rows[0];
    if (incidentRow.assigned_responder_id) {
      await client.query(
        `UPDATE responders
         SET status = 'available',
             assigned_incident_id = NULL,
             updated_at = NOW()
         WHERE id = $1`,
        [incidentRow.assigned_responder_id]
      );
    }

    await client.query("COMMIT");
    const incident = mapIncident(incidentRow);
    emitUpdatedIncident(incident);
    return incident;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getIncidents = async () => {
  const result = await query(
    `SELECT * FROM incidents ORDER BY created_at DESC`
  );
  return result.rows.map(mapIncident);
};

const getIncidentStats = async () => {
  const result = await query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status = 'detected')::int AS detected,
       COUNT(*) FILTER (WHERE status = 'verified')::int AS verified,
       COUNT(*) FILTER (WHERE status = 'dispatched')::int AS dispatched,
       COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved
     FROM incidents`
  );
  return result.rows[0];
};

module.exports = {
  createIncident,
  verifyIncident,
  resolveIncident,
  getIncidents,
  getIncidentStats,
  getIncidentById,
};
