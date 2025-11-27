// src/redux/thunks/chatThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserChats = createAsyncThunk(
  "chats/fetchUserChats",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/my-chats`,
        { withCredentials: true }
      );

      return res.data.chats;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch chats");
    }
  }
);
