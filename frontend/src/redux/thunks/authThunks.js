// src/redux/thunks/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

/* LOGIN */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
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
      const res = await axios.post(`${API}/api/auth/register`, {
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
