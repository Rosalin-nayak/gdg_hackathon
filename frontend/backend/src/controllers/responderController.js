const dispatchService = require('../services/dispatchService');
const { getIO } = require('../sockets/socketServer');

const createResponder = (req, res) => {
    const { name, location } = req.body;
    if (!name || !location) {
        return res.status(400).json({
            success: false,
            message: "name and location required"
        });
    }

    const responder = {
        id: Date.now().toString(),
        name,
        status: "available",
        location,
        assignedIncident: null
    };

    const responders = dispatchService.getResponders();
    responders.push(responder);
    res.status(201).json({
        success: true,
        data: responder
    });
};

const getResponders = (req, res) => {
    const responders = dispatchService.getResponders();
    res.json({
        success: true,
        data: responders
    });
};

const updateResponderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const responders = dispatchService.getResponders();
    const responder = responders.find(r => r.id === id);

    if (!responder) {
        return res.status(404).json({
            success: false,
            message: "Responder not found"
        });
    }

    responder.status = status;

    res.json({
        success: true,
        data: responder
    });
};

const updateResponderLocation = (req, res) => {
    const { id } = req.params;
    const { location } = req.body;
    const responder = dispatchService.updateResponderLocation(id, location);
    if (!responder) {
        return res.status(404).json({
            success: false,
            message: "Responder not found"
        });
    }

    const io = getIO();
    io.emit("responder:updated", responder);

    res.json({
        success: true,
        data: responder
    });
};

module.exports = {createResponder, getResponders, updateResponderStatus, updateResponderLocation};