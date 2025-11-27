// src/redux/slices/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socketSlice = createSlice({
  name: "socket",
  initialState: { socket: null },

  reducers: {
    connectSocket: (state, action) => {
      const userId = action.payload;
      if (!userId) return;

      if (!state.socket) {
        state.socket = io(import.meta.env.VITE_BACKEND_URL, {
          transports: ["websocket"],
          withCredentials: true,
        });

        state.socket.emit("setup", userId);
      }
    },

    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
