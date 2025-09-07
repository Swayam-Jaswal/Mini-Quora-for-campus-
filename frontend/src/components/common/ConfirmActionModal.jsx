import React, { useEffect, useState } from "react";

export default function ConfirmActionModal({ isOpen, onClose, onConfirm, title, description, confirmWord }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!isOpen) setInput("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
        <p className="text-zinc-300 mb-4">{description}</p>

        <p className="text-sm text-zinc-400 mb-2">
          Type <span className="font-mono font-semibold">{confirmWord}</span> to confirm:
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          autoFocus
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); }}
            disabled={input !== confirmWord}
            className={`px-4 py-2 rounded text-white ${
              input === confirmWord ? "bg-red-600 hover:bg-red-700" : "bg-red-900 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
