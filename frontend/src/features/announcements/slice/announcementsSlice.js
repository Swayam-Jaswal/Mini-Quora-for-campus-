import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../app/api";

// --- Async thunks ---
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/announcements");
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
      const res = await api.post("/api/announcements", announcement);
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
      const res = await api.put(`/api/announcements/${id}`, data);
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
      await api.delete(`/api/announcements/${id}`);
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
  reducers: {
    // ✅ socket-driven reducers with dedupe
    addAnnouncement: (state, action) => {
      const exists = state.items.some((a) => a._id === action.payload._id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    editAnnouncement: (state, action) => {
      state.items = state.items.map((a) =>
        a._id === action.payload._id ? action.payload : a
      );
    },
    removeAnnouncement: (state, action) => {
      state.items = state.items.filter((a) => a._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        const exists = state.items.some((a) => a._id === action.payload._id);
        if (!exists) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      });
  },
});

export const { addAnnouncement, editAnnouncement, removeAnnouncement } =
  announcementsSlice.actions;

export default announcementsSlice.reducer;
