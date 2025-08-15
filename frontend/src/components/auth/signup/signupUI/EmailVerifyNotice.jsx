import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmailVerifyNotice({ email }) {
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [coolDown, setCoolDown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
      if (res.data?.isVerified === true) {
        toast.success('Email Verified! Redirecting...');
        clearInterval(interval);
        navigate('/');
      }
    } catch {}
  }, 5000);

  return () => clearInterval(interval);
}, [navigate]);


  useEffect(() => {
    if (coolDown <= 0) return;
    const timer = setInterval(() => {
      setCoolDown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [coolDown]);

  const resendEmail = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/resend-verification`, { email });
      toast.success(res.data.message);
      setResendCount(prev => prev + 1);
      setCoolDown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 text-center">
      <h2 className="text-3xl font-semibold text-white mb-4">
        Verify Your Email
      </h2>
      <p className="text-zinc-300 mb-3">
        We’ve sent a verification link to{" "}
        <span className="font-semibold">{email}</span>.
      </p>
      <p className="text-zinc-400 text-sm mb-6">
        Please check your inbox and click the link to complete your signup.
      </p>
      <div className="text-sm text-zinc-500">
        Didn’t receive the email?{" "}
        <button
          className="text-blue-500 hover:underline font-medium disabled:opacity-50"
          onClick={resendEmail}
          disabled={loading || coolDown > 0}
        >
          {loading
            ? "Resending..."
            : coolDown > 0
            ? `You can resend link in ${coolDown}s`
            : resendCount === 0
            ? "Resend Verification Link"
            : "Resend Verification Link Again?"}
        </button>
      </div>
    </div>
  );
}
