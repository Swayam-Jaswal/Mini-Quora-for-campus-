import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Normalizer ensures anonymous always shows correctly
const normalizeQuestion = (q) => {
  return {
    ...q,
    authorId: q.author?._id || q.authorId || null,
    authorName: q.isAnonymous ? "Anonymous User" : (q.author?.name || q.authorName),
  };
};

// 🔹 Fetch all questions
export const fetchQuestions = createAsyncThunk(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/questions/get-all-questions`);
      return res.data.questions.map(normalizeQuestion);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch questions");
    }
  }
);

// 🔹 Fetch single question by ID
export const fetchQuestionById = createAsyncThunk(
  "questions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/questions/get-question/${id}`);
      return normalizeQuestion(res.data.question);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch question");
    }
  }
);

// 🔹 Delete question
export const deleteQuestion = createAsyncThunk(
  "questions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/questions/delete-question/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete question");
    }
  }
);

// 🔹 Update question
export const updateQuestion = createAsyncThunk(
  "questions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/questions/update-question/${id}`,
        data,
        { withCredentials: true }
      );
      return normalizeQuestion(res.data.question);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update question");
    }
  }
);

// 🔹 Create new question
export const createQuestion = createAsyncThunk(
  "questions/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/questions/create-question`,
        data,
        { withCredentials: true }
      );
      return normalizeQuestion({ ...res.data.question, answersCount: 0 });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create question");
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
    socketQuestionCreated: (state, action) => {
      const q = normalizeQuestion(action.payload);
      if (!state.list.find((x) => x._id === q._id)) state.list.unshift(q);
    },
    socketQuestionUpdated: (state, action) => {
      const q = normalizeQuestion(action.payload);
      state.list = state.list.map((x) => (x._id === q._id ? q : x));
      if (state.current && state.current._id === q._id) state.current = q;
    },
    socketQuestionDeleted: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((x) => x._id !== id);
      if (state.current && state.current._id === id) state.current = null;
    },
    socketIncrementAnswersCount: (state, action) => {
      const { questionId, delta } = action.payload;
      state.list = state.list.map((q) =>
        q._id === questionId ? { ...q, answersCount: (q.answersCount || 0) + delta } : q
      );
      if (state.current && state.current._id === questionId) {
        state.current = {
          ...state.current,
          answersCount: (state.current.answersCount || 0) + delta,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.list.find((q) => q._id === action.payload._id)) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((q) => q._id !== action.payload);
        if (state.current && state.current._id === action.payload) state.current = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((q) => (q._id === action.payload._id ? action.payload : q));
        if (state.current && state.current._id === action.payload._id) {
          state.current = action.payload;
        }
      });
  },
});

export const {
  clearCurrent,
  socketQuestionCreated,
  socketQuestionUpdated,
  socketQuestionDeleted,
  socketIncrementAnswersCount,
} = questionSlice.actions;

export default questionSlice.reducer;
