// src/redux/thunks/messageThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* FETCH MESSAGES */
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (chatId, thunkAPI) => {
    if (!chatId) return [];

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/${chatId}`,
        { withCredentials: true }
      );

      return res.data.messages;
    } catch (_) {
      return thunkAPI.rejectWithValue("Failed to fetch messages");
    }
  }
);

/* SEND MESSAGE */
export const sendMessageThunk = createAsyncThunk(
  "messages/sendMessage",
  async ({ chatId, content }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/send`,
        { chatId, content },
        { withCredentials: true }
      );

      return res.data.message;
    } catch (_) {
      return thunkAPI.rejectWithValue("Failed to send message");
    }
  }
);
