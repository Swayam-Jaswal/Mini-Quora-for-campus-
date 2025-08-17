import React from "react";

export default function AnswerForm() {
  return (
    <div className="bg-black/30 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">Your Answer</h2>

      <textarea
        placeholder="Write your answer..."
        rows={4}
        className="w-full p-2 mb-3 rounded-lg bg-black/20 text-white placeholder-gray-400 outline-none"
      />

      <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-medium transition">
        Post Answer
      </button>
    </div>
  );
}
