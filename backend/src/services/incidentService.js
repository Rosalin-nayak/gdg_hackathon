let incidents = [];

const createIncident = (data, io) => {
    const {type, title, description, location} = data;

    if (!type || !location) {
        throw new Error("Type and location are required");
    }

    const newIncident = {
        id: Date.now().toString(),
        type,
        title: title || `${type.toUpperCase()} detected`,
        description: description || "",
        location,
        status: "detected",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    incidents.push(newIncident);

    console.log("Incident Created:", newIncident);
    io.emit("incident:new", newIncident);

    return newIncident;
};

const verifyIncident = (id, io) => {
    const incident = incidents.find(i => i.id === id);

    if (!incident) {
        throw new Error("Incident not found");
    }

    incident.status = "verified";
    incident.verifiedAt = new Date();
    incident.updatedAt = new Date();

    console.log("Incident Verified:", incident);
    io.emit("incident:updated", incident);

    return incident;
};

const resolveIncident = (id, io) => {
    const incident = incidents.find(i => i.id === id);

    if (!incident) {
        throw new Error("Incident not found");
    }
    incident.status = "resolved";
    incident.resolvedAt = new Date();
    incident.updatedAt = new Date();

    console.log("Incident Resolved:", incident);
    io.emit("incident:updated", incident);

    return incident;
};

const getIncidents = () => {return incidents};

module.exports = {createIncident, verifyIncident, resolveIncident, getIncidents};