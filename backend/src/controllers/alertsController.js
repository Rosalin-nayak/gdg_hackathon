const incidentService = require('../services/incidentService');

const createAlert = (req, res) => {
    try {
        const io = req.app.get("io");
        const { type, location, cameraId, confidence } = req.body;
        const incidentData = {
            type,
            title: `${type} detected`,
            description: `Camera: ${cameraId}, Confidence: ${confidence}`,
            location
        };

        const incident = incidentService.createIncident(incidentData, io);
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

module.exports = {createAlert};