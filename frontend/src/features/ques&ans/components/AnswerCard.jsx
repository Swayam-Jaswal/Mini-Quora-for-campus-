import React from "react";
import { User } from "lucide-react";

export default function AnswerCard() {
  return (
    <div className="bg-black/20 p-3 rounded-xl shadow">
      <div className="flex items-center gap-2 mb-2">
        <User size={16} className="text-gray-400" />
        <span className="text-sm text-gray-300">John Doe</span>
      </div>

      <p className="text-gray-200 text-sm">
        This is an example answer. It explains the solution in detail.
      </p>
    </div>
  );
}