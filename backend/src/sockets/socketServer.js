const {Server} = require("socket.io");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        socket.on("disconnect", () => {});
    });
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
};

module.exports = { initSocket, getIO };
