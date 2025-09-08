import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questionReducer from '../features/ques&ans/slices/questionSlice';
import answerReducer from '../features/ques&ans/slices/answerSlice';
import adminReducer from '../features/admin/slices/adminSlice';
import announcementsReducer from '../features/announcements/slice/announcementsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionReducer,
    answers: answerReducer,
    admin: adminReducer,
    announcements: announcementsReducer,
  },
});
