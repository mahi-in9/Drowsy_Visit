// src/redux/slices/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, sendMessageThunk } from "../thunks/messageThunks";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,

  reducers: {
    addMessageRealtime(state, action) {
      state.list.push(action.payload);
    },

    editMessageRealtime(state, action) {
      const { messageId, newContent } = action.payload;
      state.list = state.list.map((m) =>
        m._id === messageId ? { ...m, content: newContent, edited: true } : m
      );
    },

    deleteMessageRealtime(state, action) {
      const { messageId, forEveryone } = action.payload;

      state.list = state.list.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              content: forEveryone ? "" : msg.content,
              isDeletedForEveryone: forEveryone,
            }
          : msg
      );
    },

    updateMessageReaction(state, action) {
      const { messageId, emoji, userId } = action.payload;

      state.list = state.list.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [{ emoji, user: userId }],
            }
          : msg
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load messages";
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const {
  addMessageRealtime,
  editMessageRealtime,
  deleteMessageRealtime,
  updateMessageReaction,
} = messageSlice.actions;

export default messageSlice.reducer;
