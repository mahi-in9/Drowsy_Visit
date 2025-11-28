import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

/* =====================================================
   THUNKS
====================================================== */

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (search = "", { rejectWithValue }) => {
    try {
      const res = await axios.get(`/users/all?search=${search}`);
      return res.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load users"
      );
    }
  }
);

// Follow user
export const followUser = createAsyncThunk(
  "users/followUser",
  async (targetUserId, { rejectWithValue }) => {
    try {
      await axios.put(`/users/follow/${targetUserId}`);
      return targetUserId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
  "users/unfollowUser",
  async (targetUserId, { rejectWithValue }) => {
    try {
      await axios.put(`/users/unfollow/${targetUserId}`);
      return targetUserId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user"
      );
    }
  }
);

/* =====================================================
   SLICE
====================================================== */

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    /* ---- FETCH USERS ---- */
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // store full user array
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* ---- FOLLOW USER ---- */
    builder.addCase(followUser.fulfilled, (state, action) => {
      const userId = action.payload;

      state.list = state.list.map((u) =>
        u._id === userId
          ? { ...u, isFollowing: true, followers: [...u.followers, "temp"] }
          : u
      );
    });

    /* ---- UNFOLLOW USER ---- */
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      const userId = action.payload;

      state.list = state.list.map((u) =>
        u._id === userId
          ? {
              ...u,
              isFollowing: false,
              followers: u.followers.filter(() => false),
            }
          : u
      );
    });
  },
});

export default userSlice.reducer;
