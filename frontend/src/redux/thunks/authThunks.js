// src/redux/thunks/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

/* LOGIN */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      return res.data; // { token, user }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* REGISTER */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, username, email, password }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        username,
        email,
        password,
      });

      return res.data; // { token, user }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);
