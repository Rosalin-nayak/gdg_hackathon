const incidentService = require("../services/incidentService");

const createIncident = async (req, res) => {
  try {
    const incident = await incidentService.createIncident(req.body);
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

const getIncidents = async (req, res) => {
  try {
    const incidents = await incidentService.getIncidents();
    res.json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyIncident = async (req, res) => {
  try {
    const incident = await incidentService.verifyIncident(req.params.id);
    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const resolveIncident = async (req, res) => {
  try {
    const incident = await incidentService.resolveIncident(req.params.id);
    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getIncidentStats = async (req, res) => {
  try {
    const stats = await incidentService.getIncidentStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  verifyIncident,
  resolveIncident,
  getIncidentStats,
};
