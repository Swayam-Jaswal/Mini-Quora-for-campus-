import React,{useEffect} from "react";
import Navbar from "../../../components/layout/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions, createQuestion } from "../slices/questionSlice";
import QuestionCard from '../components/QuestionCard';
import QuestionForm from '../components/QuestionForm';

export default function QnaPage() {
  const dispatch = useDispatch();
  const {list:questions,loading,error} = useSelector(
    (state)=>state.questions
  )

  useEffect(()=>{
    dispatch(fetchQuestions())
  },[dispatch]);

  const handleQuestionSubmit=(data)=>{
    return dispatch(createQuestion(data));
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-3xl bg-black/20 rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Questions & Answers</h1>

          {/* Question Form */}
          <QuestionForm onSubmit={handleQuestionSubmit} />

          {/* Loading / Error */}
          {loading && <p className="text-gray-400">Loading questions...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {/* Questions */}
          <div className="mt-4 space-y-4">
            {questions.map((q) => (
              <QuestionCard
                key={q._id}
                id={q._id}
                title={q.title}
                body={q.body}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
