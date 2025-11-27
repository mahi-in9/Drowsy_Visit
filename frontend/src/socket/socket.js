import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
