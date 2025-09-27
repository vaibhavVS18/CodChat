import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  socketInstance = io(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  // Debugging
  socketInstance.on("connect", () => {
    console.log("✅ Connected to socket server:", socketInstance.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });

  return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
  if (!socketInstance) return;
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  if (!socketInstance) return;
  socketInstance.emit(eventName, data);
};
