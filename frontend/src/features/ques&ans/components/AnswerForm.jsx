import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AnswerForm({ onSubmit, initialBody = "", mode = "create" }) {
  const [formData, setFormData] = useState({ body: initialBody });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ body: initialBody });
  }, [initialBody]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.body.trim()) {
      return toast.error("Body cannot be empty");
    }
    setLoading(true);
    try {
      await onSubmit({ body: formData.body.trim() });
      if (mode === "create") {
        setFormData({ body: "" });
      }
      toast.success(
        mode === "edit"
          ? "Answer updated successfully"
          : "Answer posted successfully"
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        name="body"
        value={formData.body}
        onChange={handleOnChange}
        placeholder="Write your answer..."
        className="w-full p-3 rounded-lg bg-[#374151] text-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        {loading ? "Saving..." : mode === "edit" ? "Update Answer" : "Post Answer"}
      </button>
    </form>
  );
}
