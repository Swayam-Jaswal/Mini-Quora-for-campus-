// src/features/qna/pages/QuestionDetailsPage.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MessageSquarePlus, CornerDownRight } from "lucide-react";
import { toast } from "react-toastify";

import { fetchQuestionById } from "../slices/questionSlice";
import {
  fetchAnswers,
  createAnswer,
  clearAnswers,
  socketAnswerCreated,
  socketAnswerUpdated,
  socketAnswerDeleted,
} from "../slices/answerSlice";
import { socketIncrementAnswersCount } from "../slices/questionSlice";

import QuestionCard from "../components/QuestionCard";
import AnswerCard from "../components/AnswerCard";
import AnswerForm from "../components/AnswerForm";
import Navbar from "../../../components/layout/Navbar";
import QuickLinks from "../../home/components/QuickLinks";
import BackButton from "../../../components/common/BackButton";
import { socket } from "../../../app/socket";

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current: question, loading: questionLoading } = useSelector(
    (state) => state.questions
  );
  const { list: answers, loading: answersLoading } = useSelector(
    (state) => state.answers
  );

  useEffect(() => {
    dispatch(fetchQuestionById(id));
    dispatch(fetchAnswers(id));
    return () => dispatch(clearAnswers());
  }, [dispatch, id]);

  // SOCKET EVENTS
  useEffect(() => {
    const onCreated = ({ questionId, answer }) => {
      if (questionId === id) {
        dispatch(socketAnswerCreated(answer));
        dispatch(socketIncrementAnswersCount({ questionId, delta: 1 }));
      }
    };
    const onUpdated = ({ questionId, answer }) => {
      if (questionId === id) dispatch(socketAnswerUpdated(answer));
    };
    const onDeleted = ({ questionId, answerId }) => {
      if (questionId === id) {
        dispatch(socketAnswerDeleted(answerId));
        dispatch(socketIncrementAnswersCount({ questionId, delta: -1 }));
      }
    };

    socket.on("answerCreated", onCreated);
    socket.on("answerUpdated", onUpdated);
    socket.on("answerDeleted", onDeleted);

    return () => {
      socket.off("answerCreated", onCreated);
      socket.off("answerUpdated", onUpdated);
      socket.off("answerDeleted", onDeleted);
    };
  }, [dispatch, id]);

  const handleAnswerSubmit = async (data) => {
    try {
      await dispatch(
        createAnswer({
          questionId: id,
          body: data.body,
          attachments: data.attachments,
        })
      ).unwrap();
      toast.success("Answer posted successfully");
    } catch (error) {
      toast.error(error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f1724] to-[#0c1623] text-white">
      <Navbar />

      {/* MAIN LAYOUT — SAME AS HOMEPAGE & QNA */}
      <div className="flex flex-1 px-6 py-8 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="w-64 hidden lg:block">
          <div className="space-y-6">
            <QuickLinks />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 bg-black/20 rounded-2xl p-6 shadow-lg">

          <BackButton to="/qna" label="Back to Questions" />

          {/* Question */}
          {questionLoading ? (
            <p className="text-gray-400 mt-4">Loading question...</p>
          ) : question ? (
            <QuestionCard
              id={question._id}
              title={question.title}
              body={question.body}
              tags={question.tags}
              author={question.author}
              authorId={question.author?._id}
              authorName={question.author?.name}
              authorAvatar={question.author?.avatar}
              isAnonymous={question.isAnonymous}
              createdAt={question.createdAt}
              showFooter={false}
            />
          ) : (
            <p className="text-red-400 mt-4">Question not found</p>
          )}

          {/* Write Answer */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquarePlus size={18} />
              Write your answer
            </h3>
            <AnswerForm onSubmit={handleAnswerSubmit} />
          </div>

          {/* Answers */}
          {answersLoading && (
            <p className="text-gray-400 mt-4">Loading answers...</p>
          )}

          <div className="space-y-4 mt-6">
            {answers?.map((a) => (
              <div key={a._id} className="flex items-start gap-3">
                <CornerDownRight className="text-gray-400 mt-1 w-5 h-5" />
                <div className="flex-1">
                  <AnswerCard
                    id={a._id}
                    body={a.body}
                    author={a.author}
                    authorId={a.author?._id}
                    authorName={a.author?.name}
                    authorAvatar={a.author?.avatar}
                    isAnonymous={a.isAnonymous}
                    attachments={a.attachments}
                    date={a.createdAt}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
