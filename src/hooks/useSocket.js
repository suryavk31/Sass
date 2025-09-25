// src/hooks/useSocket.js
import { useEffect, useState } from "react";
import socket from "../Socket/socket";

const useSocket = (userId) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket.connected && userId) {
      socket.connect();
      // Let the server know which user is connected (join their room)
      socket.emit("join", userId);
    }

    // Listen for connection/disconnection events
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [userId]);

  return { socket, isConnected };
};

export default useSocket;
