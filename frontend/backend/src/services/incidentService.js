const { emitNewIncident, emitUpdatedIncident } = require('../sockets/handlers/incidentHandler');
const { assignResponder } = require('./dispatchService');

let incidents = [];

const createIncident = (data) => {
    const { type, cameraId, confidence, location } = data;
    if (!type || !cameraId || !location) {
        throw new Error("type, cameraId and location are required");
    }
    const newIncident = {
        id: Date.now().toString(),
        type,
        cameraId,
        confidence: confidence || null,
        location: {
            zone: location.zone || location,
            lat: location.lat || null,
            lng: location.lng || null
        },
        status: "detected",
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedResponder: null
    };

    incidents.push(newIncident);
    const responder = assignResponder(newIncident);
    emitNewIncident(newIncident);

    if (responder) {
        emitUpdatedIncident(newIncident);
    }

    return newIncident;
};

const verifyIncident = (id) => {
    const incident = incidents.find(i => i.id === id);

    if (!incident) {
        throw new Error("Incident not found");
    }

    incident.status = "verified";
    incident.verifiedAt = new Date();
    incident.updatedAt = new Date();

    console.log("Incident Verified:", incident);
    emitUpdatedIncident(incident);

    return incident;
};

const resolveIncident = (id) => {
    const incident = incidents.find(i => i.id === id);

    if (!incident) {
        throw new Error("Incident not found");
    }

    incident.status = "resolved";
    incident.resolvedAt = new Date();
    incident.updatedAt = new Date();

    console.log("Incident Resolved:", incident);
    emitUpdatedIncident(incident);
    return incident;
};

const getIncidents = () => {
    return incidents;
};

const getIncidentStats = () => {
    return {
        total: incidents.length,
        detected: incidents.filter(i => i.status === "detected").length,
        verified: incidents.filter(i => i.status === "verified").length,
        resolved: incidents.filter(i => i.status === "resolved").length
    };
};

module.exports = {createIncident, verifyIncident, resolveIncident, getIncidents, getIncidentStats};