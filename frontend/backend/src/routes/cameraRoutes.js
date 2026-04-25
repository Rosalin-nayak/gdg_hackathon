const express = require('express');
const router = express.Router();

const {getCameras} = require('../controllers/cameraController');

router.get('/', getCameras);

module.exports = router;   