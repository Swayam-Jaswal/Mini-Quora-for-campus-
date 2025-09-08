import React, { useState, useEffect } from "react";

export default function AnnouncementEditModal({ 
  open, 
  onClose, 
  initialData, 
  onSubmit, 
  loading 
}) {
  const [form, setForm] = useState({ text: "", type: "info" });

  useEffect(() => {
    if (initialData) {
      setForm({
        text: initialData.text || "",
        type: initialData.type || "info",
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">
          Edit Announcement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Announcement text"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
          >
            <option value="info">Info</option>
            <option value="deadline">Deadline</option>
            <option value="alert">Alert</option>
          </select>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
