const responders = [];

const setResponders = (data) => {
    responders.length = 0;
    responders.push(...data);
};

const getResponders = () => {
    return responders;
};

const findAvailableResponder = () => {
    return responders.find(r => r.status === "available");
};

const assignResponder = (incident) => {
    const responder = findAvailableResponder();
    if (!responder) return null;
    responder.status = "assigned";
    responder.assignedIncident = incident.id;
    incident.assignedResponder = responder.id;
    incident.status = "dispatched";
    incident.updatedAt = new Date();

    return responder;
};

const updateResponderLocation = (id, location) => {
    const responder = responders.find(r => r.id === id);
    if (!responder) return null;
    responder.location = location;
    responder.updatedAt = new Date();

    return responder;
};

module.exports = {setResponders, getResponders, assignResponder, updateResponderLocation};