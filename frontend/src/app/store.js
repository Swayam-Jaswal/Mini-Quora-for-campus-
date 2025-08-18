import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questionReducer from '../features/ques&ans/slices/questionSlice';
import answerReducer from '../features/ques&ans/slices/answerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions:questionReducer,
    answers:answerReducer,
  },
});