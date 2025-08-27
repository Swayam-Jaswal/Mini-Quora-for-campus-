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
import BackButton from "../../../components/common/BackButton";
import socket from "../../../app/socket";

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current: question, loading: questionLoading } = useSelector((state) => state.questions);
  const { list: answers, loading: answersLoading } = useSelector((state) => state.answers);

  useEffect(() => {
    dispatch(fetchQuestionById(id));
    dispatch(fetchAnswers(id));
    return () => {
      dispatch(clearAnswers());
    };
  }, [dispatch, id]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />
      <main className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-3xl bg-black/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <BackButton to="/qna" label="Back to Questions" />
          {questionLoading ? (
            <p className="text-gray-400">Loading question...</p>
          ) : question ? (
            <QuestionCard
              id={question._id}
              title={question.title}
              body={question.body}
              tags={question.tags}
              authorId={question.author?._id}
              authorName={question.author?.name}
              createdAt={question.createdAt}
              showFooter={false}
            />
          ) : (
            <p className="text-red-400">Question not found</p>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquarePlus size={18} />
              Write your answer
            </h3>
            <AnswerForm onSubmit={handleAnswerSubmit} />
          </div>

          {answersLoading && <p className="text-gray-400 mt-4">Loading answers...</p>}
          <div className="space-y-3 flex-1 mt-6">
            {answers?.map((a) => (
              <div key={a._id} className="flex items-start gap-2">
                <CornerDownRight className="text-gray-400 mt-1 w-5 h-5" />
                <div className="flex-1">
                  <AnswerCard
                    id={a._id}
                    body={a.body}
                    author={a.author}
                    isAnonymous={a.isAnonymous}
                    attachments={a.attachments}
                    date={a.createdAt}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
