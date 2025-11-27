// src/hooks/useSocket.js
import { useSelector } from "react-redux";

export const useSocket = () => {
  // socketSlice has shape: { socket: <socket instance or null> }
  const socket = useSelector((state) => state.socket.socket);
  return socket;
};
