import { io } from "socket.io-client";

const socket = io("https://backend.vivimart.in", {
    withCredentials: true, // Include credentials if needed
    transports: ['polling', 'websocket'],
});

// Listen for connection
socket.on("connect", () => {
    // console.log("Connected to Socket.IO server:", socket.id);
});

// Handle connection errors
socket.on("connect_error", (err) => {
    // console.error("Connection Error:", err);
});

export default socket;