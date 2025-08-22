import React from "react";
import { X } from "lucide-react";
import AnswerForm from "./AnswerForm";

export default function AnswerModal({ open, onClose, onSubmit, initialBody = "", mode = "create" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] w-full max-w-lg rounded-2xl p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-gray-700 p-2 rounded-full text-gray-300 hover:bg-gray-600 hover:text-white shadow-md"
        >
          <X size={20} />
        </button>

        <AnswerForm onSubmit={onSubmit} initialBody={initialBody} mode={mode} />
      </div>
    </div>
  );
}
