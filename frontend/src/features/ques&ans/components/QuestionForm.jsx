import React from "react";

export default function QuestionForm() {
  return (
    <div className="bg-black/30 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">Ask a Question</h2>
      
      <input
        type="text"
        placeholder="Enter your question title"
        className="w-full p-2 mb-3 rounded-lg bg-black/20 text-white placeholder-gray-400 outline-none"
      />

      <textarea
        placeholder="Describe your question..."
        rows={4}
        className="w-full p-2 mb-3 rounded-lg bg-black/20 text-white placeholder-gray-400 outline-none"
      />

      <input
        type="text"
        placeholder="Enter tags (comma separated)"
        className="w-full p-2 mb-3 rounded-lg bg-black/20 text-white placeholder-gray-400 outline-none"
      />

      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 font-medium transition">
        Post Question
      </button>
    </div>
  );
}
