import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAnswers = createAsyncThunk("answers/fetchByQuestion",async(questionId)=>{
    const res = await axios.get(`${BASE_URL}/api/answers/get-answers/${questionId}`);
    return res.data;
});

export const createAnswer = createAsyncThunk("answers/create", async ({ questionId, body }, { getState }) => {
  const token = getState().auth.user?.token;
  const res = await axios.post(
    `${BASE_URL}/api/answers/create-answer/${questionId}`,
    { body },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.answer;
});

const answerSlice = createSlice({
  name: "answers",
  initialState: {
    list: [],
    loading: flase,
    error: null,
  },
  reducers: {
    clearAnswer: (state) => {
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
        state.error = action.error.message;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { clearAnswers } = answerSlice.actions;
export default answerSlice.reducer;