const incidentService = require("../services/incidentService");

const createAlert = async (req, res) => {
  try {
    const serviceKey = process.env.INTERNAL_SERVICE_KEY;

    if (!serviceKey) {
      return res.status(503).json({
        success: false,
        message: "Server misconfigured: INTERNAL_SERVICE_KEY is not set",
      });
    }

    if (req.headers["x-service-key"] !== serviceKey) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { type, location, cameraId, confidence } = req.body;
    if (!cameraId) {
      throw new Error("Camera ID required");
    }

    if (!type || !location) {
      throw new Error("Type and location are required");
    }

    const incident = await incidentService.createIncident({
      type,
      cameraId,
      confidence,
      location,
    });

    res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createAlert };
