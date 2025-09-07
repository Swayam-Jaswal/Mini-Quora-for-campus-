import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../app/api";

export const fetchStats = createAsyncThunk("admin/fetchStats", async () => {
  const res = await api.get("/admin/stats");
  return res.data;
});

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (page = 1) => {
  const res = await api.get(`/admin/users?page=${page}&limit=10`);
  return res.data;
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  await api.delete(`/admin/users/${id}`);
  return id;
});

export const generateAdminCode = createAsyncThunk("admin/generateAdminCode", async () => {
  const res = await api.post("/admin/generate-admin-code");
  return res.data;
});

export const generateModeratorCode = createAsyncThunk("admin/generateModeratorCode", async () => {
  const res = await api.post("/admin/generate-moderator-code");
  return res.data;
});

export const promoteUser = createAsyncThunk("admin/promoteUser", async (userId) => {
  const res = await api.put("/admin/promote-to-moderator", { userId });
  return res.data.user;
});

export const demoteUser = createAsyncThunk("admin/demoteUser", async (userId) => {
  const res = await api.put("/admin/demote-to-user", { userId });
  return res.data.user;
});

// ✅ New: Superadmin actions
export const promoteAdmin = createAsyncThunk("admin/promoteAdmin", async (userId) => {
  const res = await api.put("/admin/promote-to-admin", { userId });
  return res.data.user;
});

export const demoteAdmin = createAsyncThunk("admin/demoteAdmin", async (userId) => {
  const res = await api.put("/admin/demote-admin-to-user", { userId });
  return res.data.user;
});

export const fetchCodes = createAsyncThunk("admin/fetchCodes", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/codes");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch codes");
  }
});

export const deleteCode = createAsyncThunk("admin/deleteCode", async (id) => {
  await api.delete(`/admin/codes/${id}`);
  return id;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    totalUsers: 0,
    codes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchStats.pending, (s) => { s.loading = true; })
      .addCase(fetchStats.fulfilled, (s, a) => { s.loading = false; s.stats = a.payload; })
      .addCase(fetchStats.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      // Users
      .addCase(fetchUsers.pending, (s) => { s.loading = true; })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload.data || [];
        s.totalUsers = a.payload.pagination?.total || 0;
      })
      .addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      // Moderator promotion/demotion
      .addCase(promoteUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload._id);
        if (idx !== -1) s.users[idx] = a.payload;
      })
      .addCase(demoteUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload._id);
        if (idx !== -1) s.users[idx] = a.payload;
      })

      // ✅ Admin promotion/demotion (superadmin only)
      .addCase(promoteAdmin.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload._id);
        if (idx !== -1) s.users[idx] = a.payload;
      })
      .addCase(demoteAdmin.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload._id);
        if (idx !== -1) s.users[idx] = a.payload;
      })

      // Codes
      .addCase(fetchCodes.pending, (s) => { s.loading = true; })
      .addCase(fetchCodes.fulfilled, (s, a) => {
        s.loading = false;
        s.codes = Array.isArray(a.payload) ? a.payload : a.payload.codes || [];
      })
      .addCase(fetchCodes.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(deleteCode.fulfilled, (s, a) => {
        s.codes = s.codes.filter((c) => c._id !== a.payload);
      })

      // User delete
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter((u) => u._id !== a.payload);
        s.totalUsers = Math.max(0, s.totalUsers - 1);
      })

      // Code generation
      .addCase(generateAdminCode.fulfilled, (s, a) => { s.codes.push(a.payload); })
      .addCase(generateModeratorCode.fulfilled, (s, a) => { s.codes.push(a.payload); });
  },
});

export default adminSlice.reducer;
