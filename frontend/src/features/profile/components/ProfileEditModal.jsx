// src/features/profile/components/ProfileEditModal.jsx
import { useEffect, useRef, useState } from "react";
import FocusLock from "react-focus-lock";

export default function ProfileEditModal({ open, onClose, field, currentValue, onSave }) {
  const openerRef = useRef(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      setValue(currentValue || "");
    } else {
      if (openerRef.current && typeof openerRef.current.focus === "function") {
        openerRef.current.focus();
      }
    }
  }, [open, currentValue]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(value.trim());
  };

  const labelMap = {
    name: "Name",
    bio: "Bio",
    tagline: "Tagline",
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <FocusLock returnFocus={true}>
          <h2 id="edit-profile-title" className="text-xl font-semibold mb-4 text-blue-400">
            Edit {labelMap[field] || "Field"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field === "bio" ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                className="w-full rounded-lg px-3 py-2 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={`Enter your ${labelMap[field]}`}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-lg px-3 py-2 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={`Enter your ${labelMap[field]}`}
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                Save
              </button>
            </div>
          </form>
        </FocusLock>
      </div>
    </div>
  );
}
