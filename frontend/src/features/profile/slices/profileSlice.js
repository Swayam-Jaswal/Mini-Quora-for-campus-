// src/features/profile/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../app/api";

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

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (updates, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/users", updates);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload;
      })
      .addCase(fetchProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(updateProfile.pending, (s) => {
        s.loading = true;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload;
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export default profileSlice.reducer;
