// src/redux/slices/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  accessChat,
  getUserChats,
  createGroupChat,
  addMemberToGroup,
  removeMemberFromGroup,
  renameGroup,
} from "../thunks/chatThunks";

const initialState = {
  chats: [], // all chats of logged in user
  activeChat: null, // currently opened chat
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
    /* ==============================
       ACCESS / CREATE DM CHAT
    =============================== */
    builder
      .addCase(accessChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.loading = false;
        const chat = action.payload;

        // Prevent duplicate insertion
        const exists = state.chats.find((c) => c._id === chat._id);
        if (!exists) {
          state.chats.unshift(chat);
        }

        state.activeChat = chat;
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ==============================
       GET ALL USER CHATS
    =============================== */
    builder
      .addCase(getUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(getUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ==============================
       CREATE GROUP CHAT
    =============================== */
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.chats.unshift(action.payload);
    });

    /* ==============================
       ADD MEMBER TO GROUP
    =============================== */
    builder.addCase(addMemberToGroup.fulfilled, (state, action) => {
      const updated = action.payload;
      state.chats = state.chats.map((c) =>
        c._id === updated._id ? updated : c
      );
    });

    /* ==============================
       REMOVE MEMBER FROM GROUP
    =============================== */
    builder.addCase(removeMemberFromGroup.fulfilled, (state, action) => {
      const updated = action.payload;
      state.chats = state.chats.map((c) =>
        c._id === updated._id ? updated : c
      );
    });

    /* ==============================
       RENAME GROUP
    =============================== */
    builder.addCase(renameGroup.fulfilled, (state, action) => {
      const updated = action.payload;
      state.chats = state.chats.map((c) =>
        c._id === updated._id ? updated : c
      );
    });
  },
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
