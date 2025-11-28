// src/redux/slices/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  sendMessageThunk,
  fetchMessagesThunk,
  editMessageThunk,
  deleteMessageThunk,
  reactToMessageThunk,
} from "../thunks/messageThunks";

const messageSlice = createSlice({
  name: "messages",

  initialState: {
    data: {}, // { chatId: [messages] }
    pagination: {}, // { chatId: { page, limit, total } }
    loading: false,
    error: null,
  },

  reducers: {
    /* SOCKET: Add incoming message realtime */
    addIncomingMessage: (state, action) => {
      const msg = action.payload;
      const chatId = msg.chat._id;

      if (!state.data[chatId]) state.data[chatId] = [];

      // Prevent duplicates
      const exists = state.data[chatId].some((m) => m._id === msg._id);
      if (!exists) state.data[chatId].push(msg);
    },
  },

  extraReducers: (builder) => {
    /* FETCH MESSAGES ---------------------------------------- */
    builder
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;

        const { chatId, messages, pagination } = action.payload;

        // filter invalid messages
        const clean = messages.filter((m) => m && m.sender);

        state.data[chatId] = clean;
        state.pagination[chatId] = pagination;
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* SEND MESSAGE ------------------------------------------- */
    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const msg = action.payload;
      const chatId = msg.chat._id;

      if (!state.data[chatId]) state.data[chatId] = [];

      state.data[chatId].push(msg);
    });

    /* EDIT MESSAGE ------------------------------------------- */
    builder.addCase(editMessageThunk.fulfilled, (state, action) => {
      const updated = action.payload;
      const chatId = updated.chat._id;

      if (state.data[chatId]) {
        state.data[chatId] = state.data[chatId].map((m) =>
          m._id === updated._id ? updated : m
        );
      }
    });

    /* DELETE MESSAGE ---------------------------------------- */
    builder.addCase(deleteMessageThunk.fulfilled, (state, action) => {
      const { messageId, forEveryone } = action.payload;

      for (const chatId in state.data) {
        state.data[chatId] = state.data[chatId].map((m) =>
          m._id === messageId
            ? forEveryone
              ? { ...m, content: "", isDeletedForEveryone: true }
              : { ...m, deletedForMe: true } // front-end flag for display
            : m
        );
      }
    });

    /* REACT MESSAGE ----------------------------------------- */
    builder.addCase(reactToMessageThunk.fulfilled, (state, action) => {
      const updated = action.payload;
      const chatId = updated.chat._id;

      if (state.data[chatId]) {
        state.data[chatId] = state.data[chatId].map((m) =>
          m._id === updated._id ? updated : m
        );
      }
    });
  },
});

export const { addIncomingMessage } = messageSlice.actions;
export default messageSlice.reducer;
