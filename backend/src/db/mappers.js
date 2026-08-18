const mapIncident = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    cameraId: row.camera_id,
    confidence: row.confidence,
    location: {
      zone: row.zone,
      lat: row.lat,
      lng: row.lng,
    },
    status: row.status,
    assignedResponder: row.assigned_responder_id,
    verifiedAt: row.verified_at,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapResponder = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    location: {
      zone: row.zone,
      lat: row.lat,
      lng: row.lng,
    },
    assignedIncident: row.assigned_incident_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapCamera = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    location: {
      zone: row.zone,
      lat: row.lat,
      lng: row.lng,
    },
  };
};

module.exports = { mapIncident, mapResponder, mapCamera };
