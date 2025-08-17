import React from "react";
import { MessageCircle } from "lucide-react";

export default function QuestionCard() {
  return (
    <div className="bg-black/30 p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">
        Example Question Title
      </h3>

      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
        This is a short preview of the question body text...
      </p>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs bg-white/10 rounded-lg text-gray-200">
            #example
          </span>
          <span className="px-2 py-1 text-xs bg-white/10 rounded-lg text-gray-200">
            #tag
          </span>
        </div>

        <div className="flex items-center gap-1 text-blue-400">
          <MessageCircle size={16} />
          View Answers
        </div>
      </div>
    </div>
  );
}
