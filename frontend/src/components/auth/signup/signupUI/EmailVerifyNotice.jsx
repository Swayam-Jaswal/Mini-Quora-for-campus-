import React from 'react'

export default function EmailVerifyNotice() {
  return (
    <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 text-center">
      <h2 className="text-3xl font-semibold text-white mb-4">
        Verify Your Email
      </h2>
      <p className="text-zinc-300 mb-3">
        We’ve sent a verification link to your email address.
      </p>
      <p className="text-zinc-400 text-sm mb-6">
        Please check your inbox and click the link to complete your signup.
      </p>
      <div className="text-sm text-zinc-500">
        Didn’t receive the email?{" "}
        <button
          className="text-blue-500 hover:underline font-medium"
          onClick={() => {/* resend logic */}}
        >
          Resend verification link
        </button>
      </div>
    </div>
  );
}