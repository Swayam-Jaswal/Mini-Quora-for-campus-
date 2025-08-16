import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don’t show back button on Home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-white transition"
    >
      <ArrowLeft size={18} /> Back
    </button>
  );
}
