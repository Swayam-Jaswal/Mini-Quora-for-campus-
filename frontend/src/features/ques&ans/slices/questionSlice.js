import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchQuestions = createAsyncThunk("questions/fetchAll",async()=>{
    const res = await axios.get(`${BASE_URL}/api/questions/get-all-questions`);
    return res.data.questions;
});

export const fetchQuestionById = createAsyncThunk("quetions/fetchById",async()=>{
    const res = await axios.get(`${BASE_URL}/api/questions/get-question/${id}`);
    return res.data.question;
});

export const createQuestion = createAsyncThunk("questions/create",async(data,{getState})=>{
    const token = getState().auth.user?.token;
    const res = await axios.post(`${BASE_URL}/api/questions/create-question`,data,{
        headers:{Authorization:`bearer${token}`}
    });
    return res.data.question;
});

const questionSlice = createSlice({
    name:"question",
    initialState:{
        list:[],
        current:null,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchQuestions.pending,(state)=>{state.loading=true;})
            .addCase(fetchQuestions.fulfilled,(state,action)=>{
                state.loading=false;
                state.list=action.payload;
            })
            .addCase(fetchQuestions.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message;
            })
            
            .addCase(fetchQuestionById.pending,(state)=>{state.loading=true;})
            .addCase(fetchQuestionById.fulfilled,(state,action)=>{
                state.loading=false;
                state.list=action.payload;
            })
            .addCase(fetchQuestionById.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.error.message;
            })

            .addCase(createQuestion.fulfilled,(state,action)=>{
                state.list.unshift(action.payload);
            });
    },
});

export default questionSlice.reducer;