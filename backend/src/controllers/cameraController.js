const getCameras = (req, res) => {
    const cameras = [
        {
            id: "CAM_01",
            location: {
                zone: "Lobby",
                lat: null,
                lng: null
            }
        },
        {
            id: "CAM_02",
            location: {
                zone: "Entrance",
                lat: null,
                lng: null
            }
        },
        {
            id: "CAM_03",
            location: {
                zone: "Parking",
                lat: null,
                lng: null
            }
        }
    ];

    res.json({
        success: true,
        data: cameras
    });
};

module.exports = {getCameras};