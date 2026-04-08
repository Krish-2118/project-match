import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

// Global variable to hold the Socket.IO instance
declare global {
    var io: SocketIOServer | undefined;
}

export const initSocket = (server: HTTPServer) => {
    if (!globalThis.io) {
        const io = new SocketIOServer(server, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        // Example event stub from requirements
        io.on("connection", (socket) => {
            console.log("New client connected", socket.id);

            socket.on("project:liked", (data) => {
                console.log("Project liked:", data);
                // Future: limit broadcast scope
                socket.broadcast.emit("project:liked:notification", data);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });

        globalThis.io = io;
    }
    return globalThis.io;
};

export const getIO = () => {
    if (!globalThis.io) {
        console.warn("Socket.IO not initialized yet caught by getIO");
        return null;
    }
    return globalThis.io;
};
