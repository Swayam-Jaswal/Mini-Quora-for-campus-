import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";``
import { toast } from "react-toastify";

import { fetchQuestionById } from "../slices/questionSlice";
import { fetchAnswers, createAnswer, clearAnswers } from "../slices/answerSlice";

import QuestionCard from "../components/QuestionCard";
import AnswerCard from "../components/AnswerCard";
import AnswerForm from "../components/AnswerForm";
import Navbar from "../../../components/layout/Navbar";

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current: question, loading: questionLoading } = useSelector(
    (state) => state.questions
  );
  const { list: answers, loading: answersLoading } = useSelector(
    (state) => state.answers
  );

  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestionById(id));
    dispatch(fetchAnswers(id));

    return () => {
      dispatch(clearAnswers());
    };
  }, [dispatch, id]);

  const handleAnswerSubmit = async (data) => {
    try {
      await dispatch(createAnswer({ questionId: id, body: data.body })).unwrap();
      toast.success("Answer posted successfully");
      setShowAnswerForm(false); 
    } catch (error) {
      console.error("Answer post failed:", error);
      toast.error(error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-3xl bg-black/20 rounded-2xl p-6 shadow-lg">
          {questionLoading ? (
            <p className="text-gray-400">Loading question...</p>
          ) : question ? (
            <QuestionCard
              id={question._id}
              title={question.title}
              body={question.body}
              tags={question.tags}
              authorId={question.author?._id}
            />
          ) : (
            <p className="text-red-400">Question not found</p>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-3">
            Answers ({answers?.length || 0})
          </h3>
          {answersLoading && (
            <p className="text-gray-400">Loading answers...</p>
          )}
          <div className="space-y-3">
            {answers?.map((a) => (
              <AnswerCard
                key={a._id}
                body={a.body}
                author={a.author}
                isAnonymous={a.isAnonymous}
                date={new Date(a.createdAt).toLocaleDateString()}
              />
            ))}
          </div>

          {!showAnswerForm ? (
            <button
              onClick={() => setShowAnswerForm(true)}
              className="mt-6 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 font-medium transition w-full"
            >
              <MessageSquarePlus size={18} />
              Add Answer
            </button>
          ) : (
            <AnswerForm onSubmit={handleAnswerSubmit} />
          )}
        </div>
      </main>
    </div>
  );
}
