// src/socket/socket.js
import { io } from "socket.io-client";

// Change the URL to your backend server URL if needed
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll control connection in our custom hook
});

export default socket;
