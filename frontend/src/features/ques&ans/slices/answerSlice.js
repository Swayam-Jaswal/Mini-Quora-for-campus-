import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch answers by questionId
export const fetchAnswers = createAsyncThunk(
  "answers/fetchByQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/answers/get-answers/${questionId}`);
      return res.data.answers; // 👈 backend must return { answers: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch answers");
    }
  }
);

// ✅ Create a new answer
export const createAnswer = createAsyncThunk(
  "answers/create",
  async ({ questionId, body }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/answers/create-answer/${questionId}`,
        { body },
        { withCredentials: true }
      );
      return res.data.answer; // 👈 backend must return { answer }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create answer");
    }
  }
);

const answerSlice = createSlice({
  name: "answers",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAnswers: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // new answer on top
      });
  },
});

export const { clearAnswers } = answerSlice.actions;
export default answerSlice.reducer;
