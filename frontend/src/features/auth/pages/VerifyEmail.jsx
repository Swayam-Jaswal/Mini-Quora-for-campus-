import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react"; // icons
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token missing");
      toast.error("Error verifying email");
      return;
    }

    (async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/auth/verify-email?token=${token}`
        );
        if (res.status === 200) {
          setStatus("success");
          setMessage(res.data.message || "Email verified");
          toast.success("Verification successful");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Invalid or expired link"
        );
        toast.error("Failed to verify email");
      }
    })();
  }, []);

  const handleGoLogin = () => navigate("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          {status === "verifying" && (
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="w-12 h-12 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-2">
          {status === "verifying" && "Verifying your email..."}
          {status === "success" && "Email Verified 🎉"}
          {status === "error" && "Verification Failed"}
        </h2>

        {/* Message */}
        <p className="text-zinc-300 mb-6">{message}</p>

        {/* Action Button */}
        {status === "success" && (
          <button
            onClick={handleGoLogin}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-medium transition"
          >
            Go to Login
          </button>
        )}
        {status === "error" && (
          <button
            onClick={() => navigate("/register")}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-medium transition"
          >
            Back to Signup
          </button>
        )}
      </div>
    </div>
  );
}
