// src/redux/thunks/messageThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

/* ============================================================
   SEND MESSAGE
============================================================ */
export const sendMessageThunk = createAsyncThunk(
  "messages/sendMessage",
  async ({ chatId, content, type = "text" }, thunkAPI) => {
    try {
      const res = await axios.post("/message/send", {
        chatId,
        content,
        type,
      });

      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to send message"
      );
    }
  }
);

/* ============================================================
   GET MESSAGES (Paginated)
   /api/message/:chatId?page=1&limit=40
============================================================ */
export const fetchMessagesThunk = createAsyncThunk(
  "messages/fetchMessages",
  async ({ chatId, page = 1, limit = 40 }, thunkAPI) => {
    try {
      const res = await axios.get(
        `/message/${chatId}?page=${page}&limit=${limit}`
      );

      return {
        chatId,
        messages: res.data.messages,
        pagination: res.data.pagination,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

/* ============================================================
   EDIT MESSAGE
============================================================ */
export const editMessageThunk = createAsyncThunk(
  "messages/editMessage",
  async ({ messageId, newContent }, thunkAPI) => {
    try {
      const res = await axios.put("/message/edit", {
        messageId,
        newContent,
      });

      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to edit message"
      );
    }
  }
);

/* ============================================================
   DELETE MESSAGE (for me / everyone)
============================================================ */
export const deleteMessageThunk = createAsyncThunk(
  "messages/deleteMessage",
  async ({ messageId, forEveryone = false }, thunkAPI) => {
    try {
      await axios.put("/message/delete", {
        messageId,
        forEveryone,
      });

      return { messageId, forEveryone };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

/* ============================================================
   REACT TO MESSAGE (emoji)
============================================================ */
export const reactToMessageThunk = createAsyncThunk(
  "messages/reactToMessage",
  async ({ messageId, emoji }, thunkAPI) => {
    try {
      const res = await axios.put("/message/react", {
        messageId,
        emoji,
      });

      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to react to message"
      );
    }
  }
);
