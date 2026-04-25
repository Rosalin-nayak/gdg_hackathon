const incidentService = require('../services/incidentService');

const createIncident = (req, res) => {
    try {
        const incident = incidentService.createIncident(req.body);
        res.status(201).json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getIncidents = (req, res) => {
    const incidents = incidentService.getIncidents();
    res.json({
        success: true,
        data: incidents
    });
};

const verifyIncident = (req, res) => {
    try {
        const incident = incidentService.verifyIncident(req.params.id);
        res.json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const resolveIncident = (req, res) => {
    try {
        const incident = incidentService.resolveIncident(req.params.id);
        res.json({
            success: true,
            data: incident
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getIncidentStats = (req, res) => {
    const stats = incidentService.getIncidentStats();
    res.json({
        success: true,
        data: stats
    });
};

module.exports = {createIncident, getIncidents, verifyIncident, resolveIncident, getIncidentStats};