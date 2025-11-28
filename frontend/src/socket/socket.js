// src/socket/socket.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId) return null;

  // If already connected, return existing socket
  if (socket) return socket;

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);

    // IMPORTANT: your backend expects "setup"
    socket.emit("setup", userId);
  });

  socket.on("connect_error", (err) => {
    console.error("SOCKET CONNECTION ERROR:", err.message);
  });

  return socket;
};

// Return socket safely
export const getSocket = () => socket;

// Disconnect socket safely
export const disconnectSocket = () => {
  if (socket) {
    socket.off(); // remove all listeners
    socket.disconnect();
    socket = null;
  }
};
