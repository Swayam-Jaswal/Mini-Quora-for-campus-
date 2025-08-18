import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuestionCard({ id, title, body }) {
  const navigate = useNavigate();

  return (
    <div className="bg-black/30 p-4 rounded-xl shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{body}</p>
      <button
        onClick={() => navigate(`/qna/${id}`)}
        className="text-blue-400 hover:underline text-sm"
      >
        See all answers
      </button>
    </div>
  );
}
