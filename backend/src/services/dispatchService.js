const { randomUUID } = require("crypto");
const { query } = require("../db/pool");
const { mapResponder } = require("../db/mappers");

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

const createResponder = async ({ name, location }) => {
  const loc = normalizeLocation(location);
  const id = randomUUID();
  const result = await query(
    `INSERT INTO responders (id, name, status, zone, lat, lng)
     VALUES ($1, $2, 'available', $3, $4, $5)
     RETURNING *`,
    [id, name, loc.zone, loc.lat, loc.lng]
  );
  return mapResponder(result.rows[0]);
};

const getResponders = async () => {
  const result = await query(
    `SELECT * FROM responders ORDER BY created_at ASC`
  );
  return result.rows.map(mapResponder);
};

const updateResponderStatus = async (id, status) => {
  const result = await query(
    `UPDATE responders
     SET status = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return mapResponder(result.rows[0]);
};

const updateResponderLocation = async (id, location) => {
  const loc = normalizeLocation(location);
  const result = await query(
    `UPDATE responders
     SET zone = $1,
         lat = $2,
         lng = $3,
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [loc.zone, loc.lat, loc.lng, id]
  );
  return mapResponder(result.rows[0]);
};

module.exports = {
  createResponder,
  getResponders,
  updateResponderStatus,
  updateResponderLocation,
};
