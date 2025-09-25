// src/components/Notification/Notification.jsx
import { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import { useSelector } from "react-redux";

const Notification = () => {
  const { userInfo } = useSelector((state) => state.user);
  // Pass the user ID from Redux state to the hook
  const { socket } = useSocket(userInfo?._id);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for incoming notifications
    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      socket.off("notification");
    };
  }, [socket]);

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map((note, index) => (
        <div key={index} className="bg-white p-3 shadow mb-2 rounded">
          {note.message}
        </div>
      ))}
    </div>
  );
};

export default Notification;
