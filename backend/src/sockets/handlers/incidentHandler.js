const { getIO } = require('../socketServer');

const emitNewIncident = (incident) => {
    const io = getIO();
    io.emit("incident:new", incident);
};

const emitUpdatedIncident = (incident) => {
    const io = getIO();
    io.emit("incident:updated", incident);
};

module.exports = { emitNewIncident, emitUpdatedIncident };