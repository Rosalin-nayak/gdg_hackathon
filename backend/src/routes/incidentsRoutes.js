const express = require('express');
const router = express.Router();

const {createIncident, getIncidents, verifyIncident, resolveIncident,getIncidentStats} = require('../controllers/incidentController');

router.post('/', createIncident);
router.get('/stats', getIncidentStats);
router.get('/', getIncidents);
router.put('/:id/verify', verifyIncident);
router.put('/:id/resolve', resolveIncident);

module.exports = router;