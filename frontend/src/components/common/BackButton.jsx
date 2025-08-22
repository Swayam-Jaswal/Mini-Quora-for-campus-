import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = -1, label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white transition"
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}
