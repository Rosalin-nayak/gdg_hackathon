const cameraService = require("../services/cameraService");

const getCameras = async (req, res) => {
  try {
    const cameras = await cameraService.getCameras();
    res.json({
      success: true,
      data: cameras,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getCameras };
