import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAnswers = createAsyncThunk(
  "answers/fetchByQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/answers/get-answers/${questionId}`);
      return res.data.answers;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch answers");
    }
  }
);

export const createAnswer = createAsyncThunk(
  "answers/create",
  async ({ questionId, body, attachments = [], isAnonymous = false }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/answers/create-answer/${questionId}`,
        { body, attachments, isAnonymous },
        { withCredentials: true }
      );
      return res.data.answer;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create answer");
    }
  }
);

export const updateAnswer = createAsyncThunk(
  "answers/update",
  async ({ id, body, attachments }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/answers/update-answer/${id}`,
        { body, attachments },
        { withCredentials: true }
      );
      return res.data.answer;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update answer");
    }
  }
);

export const deleteAnswer = createAsyncThunk(
  "answers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/answers/delete-answer/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete answer");
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
    socketAnswerCreated: (state, action) => {
      const a = action.payload;
      if (!state.list.find((x) => x._id === a._id)) state.list.unshift(a);
    },
    socketAnswerUpdated: (state, action) => {
      const a = action.payload;
      state.list = state.list.map((x) => (x._id === a._id ? a : x));
    },
    socketAnswerDeleted: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((x) => x._id !== id);
    },
    socketAnswersClearedForQuestion: (state, action) => {
      const qid = action.payload;
      state.list = state.list.filter((a) => String(a.question) !== String(qid));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.loading = false;
        if (!state.list.find((a) => a._id === action.payload._id)) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((a) => a._id !== action.payload);
      })
      .addCase(updateAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      });
  },
});

export const {
  clearAnswers,
  socketAnswerCreated,
  socketAnswerUpdated,
  socketAnswerDeleted,
  socketAnswersClearedForQuestion,
} = answerSlice.actions;

export default answerSlice.reducer;
