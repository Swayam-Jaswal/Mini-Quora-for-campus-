import React, { useEffect, useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import QuickLinks from "../../home/components/QuickLinks"; 
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  createQuestion,
  socketQuestionCreated,
  socketQuestionUpdated,
  socketQuestionDeleted,
  socketIncrementAnswersCount,
} from "../slices/questionSlice";
import QuestionCard from "../components/QuestionCard";
import QuestionForm from "../components/QuestionForm";
import { socket } from "../../../app/socket";

export default function QnaPage() {
  const dispatch = useDispatch();
  const { list: questions, loading, error } = useSelector(
    (state) => state.questions
  );

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    const onQCreated = ({ question }) => {
      dispatch(
        socketQuestionCreated({
          ...question,
          answersCount: question.answersCount ?? 0,
        })
      );
    };
    const onQUpdated = ({ question }) => dispatch(socketQuestionUpdated(question));
    const onQDeleted = ({ questionId }) =>
      dispatch(socketQuestionDeleted(questionId));
    const onACreated = ({ questionId }) =>
      dispatch(socketIncrementAnswersCount({ questionId, delta: 1 }));
    const onADeleted = ({ questionId }) =>
      dispatch(socketIncrementAnswersCount({ questionId, delta: -1 }));

    socket.on("questionCreated", onQCreated);
    socket.on("questionUpdated", onQUpdated);
    socket.on("questionDeleted", onQDeleted);
    socket.on("answerCreated", onACreated);
    socket.on("answerDeleted", onADeleted);

    return () => {
      socket.off("questionCreated", onQCreated);
      socket.off("questionUpdated", onQUpdated);
      socket.off("questionDeleted", onQDeleted);
      socket.off("answerCreated", onACreated);
      socket.off("answerDeleted", onADeleted);
    };
  }, [dispatch]);

  const handleQuestionSubmit = async (data) => {
    await dispatch(createQuestion(data));
    setFormOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f1724] to-[#0c1623] text-white">
      <Navbar />

      {/* MAIN LAYOUT SAME AS HOMEPAGE */}
      <div className="flex flex-1 px-6 py-8 gap-6">

        {/* LEFT SIDEBAR - SAME AS HOMEPAGE */}
        <aside className="w-64 hidden lg:block">
          <div className="space-y-6">
            <QuickLinks />

            <div className="panel p-5 rounded-2xl">
              <div className="text-white font-semibold text-lg">
                Need Help?
              </div>
              <p className="text-sm text-white/70 mt-2">
                Ask doubts or browse answers from students & faculty.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 bg-black/20 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Questions & Answers</h1>

            <button
              onClick={() => setFormOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm shadow"
            >
              + Post Question
            </button>
          </div>

          {loading && <p className="text-gray-400">Loading questions...</p>}
          {error && <p className="text-red-400">{error}</p>}

          <div className="space-y-4">
            {questions.map((q) => (
              <QuestionCard
                key={q._id}
                id={q._id}
                title={q.title}
                body={q.body}
                tags={q.tags}
                author={q.author}
                authorId={q.author?._id}
                authorName={q.author?.name}
                authorAvatar={q.author?.avatar}
                isAnonymous={q.isAnonymous}
                createdAt={q.createdAt}
                answersCount={q.answersCount}
              />
            ))}
          </div>
        </main>
      </div>

      {/* ASK QUESTION MODAL */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">
              Ask a Question
            </h2>
            <QuestionForm onSubmit={handleQuestionSubmit} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
