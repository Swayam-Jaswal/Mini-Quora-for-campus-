// src/features/profile/components/SocialLinkModal.jsx
import { useState, useEffect } from "react";

export default function SocialLinkModal({ open, onClose, platform, onSave, existingUrl }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) setUrl(existingUrl || "");
  }, [open, existingUrl]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onSave(platform, url.trim()); // parent will normalize (add https + validate)
    onClose();
  };

  const handleRemove = () => {
    onSave(platform, ""); // send empty -> backend will $unset
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">
          {existingUrl ? "Edit" : "Add"} {platform.charAt(0).toUpperCase() + platform.slice(1)} Link
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* use text type so "www..." won't be blocked by browser */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Enter your ${platform} profile link`}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            autoFocus
          />
          <div className="flex justify-between">
            <div className="flex gap-3">
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
            {existingUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
