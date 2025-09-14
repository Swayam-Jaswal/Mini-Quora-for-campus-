// src/features/profile/components/ProfileEditModal.jsx
import { useState, useEffect } from "react";

export default function ProfileEditModal({ open, onClose, title, initialValue, onSave }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue(initialValue || "");
  }, [open, initialValue]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg bg-gray-700 text-white resize-none"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
