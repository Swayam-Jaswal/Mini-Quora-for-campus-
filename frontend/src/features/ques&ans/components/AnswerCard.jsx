import React from "react";

export default function AnswerCard({ body, author, isAnonymous, date }) {
  return (
    <div className="ml-4 mt-3 bg-black/20 p-3 rounded-lg border-l-4 border-blue-400 shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-200">
          {isAnonymous ? "Anonymous" : author?.name || "Unknown User"}
        </span>
        {date && <span className="text-xs text-gray-400">{date}</span>}
      </div>
      <p className="text-sm text-gray-300">{body}</p>
    </div>
  );
}
