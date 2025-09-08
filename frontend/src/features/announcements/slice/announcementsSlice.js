// src/features/announcements/announcementsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../app/api";

// --- Async thunks ---
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/announcements");   // ✅ changed
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  "announcements/create",
  async (announcement, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/announcements", announcement); // ✅ changed
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  "announcements/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/announcements/${id}`, data); // ✅ changed
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "announcements/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/announcements/${id}`); // ✅ changed
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const announcementsSlice = createSlice({
  name: "announcements",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      // Delete
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      });
  },
});

export default announcementsSlice.reducer;
