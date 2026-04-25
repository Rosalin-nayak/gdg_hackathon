const express = require('express');
const router = express.Router();

const { createResponder, getResponders, updateResponderStatus, updateResponderLocation } = require('../controllers/responderController');

router.post('/', createResponder);
router.get('/', getResponders);
router.put('/:id/status', updateResponderStatus);
router.put('/:id/location', updateResponderLocation);

module.exports = router;