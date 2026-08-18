const dispatchService = require("../services/dispatchService");
const { getIO } = require("../sockets/socketServer");

const createResponder = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "name and location required",
      });
    }

    const responder = await dispatchService.createResponder({ name, location });
    res.status(201).json({
      success: true,
      data: responder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getResponders = async (req, res) => {
  try {
    const responders = await dispatchService.getResponders();
    res.json({
      success: true,
      data: responders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateResponderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const responder = await dispatchService.updateResponderStatus(id, status);

    if (!responder) {
      return res.status(404).json({
        success: false,
        message: "Responder not found",
      });
    }

    res.json({
      success: true,
      data: responder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateResponderLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body;
    const responder = await dispatchService.updateResponderLocation(
      id,
      location
    );

    if (!responder) {
      return res.status(404).json({
        success: false,
        message: "Responder not found",
      });
    }

    const io = getIO();
    io.emit("responder:updated", responder);

    res.json({
      success: true,
      data: responder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createResponder,
  getResponders,
  updateResponderStatus,
  updateResponderLocation,
};
