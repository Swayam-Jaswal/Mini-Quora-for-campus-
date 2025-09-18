// src/features/profile/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../app/api";

/**
 * Fetch logged-in user profile
 */
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users/me");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

/**
 * Update logged-in user profile
 */
export const updateProfile = createAsyncThunk(
  "profile/update",
  async (updates, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/users/me", updates);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProfile
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        // 👇 don’t reset the whole state.loading
        // state.loading = true; ❌ remove this
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // keep previous state and merge updates
        state.data = {
          ...state.data,
          ...action.payload,
        };
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
