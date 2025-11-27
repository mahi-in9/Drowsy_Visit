// src/redux/slices/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchUserChats } from "../thunks/chatThunks";

const initialState = {
  list: [],
  activeChat: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,

  reducers: {
    setActiveChat(state, action) {
      state.activeChat = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load chats";
      });
  },
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
