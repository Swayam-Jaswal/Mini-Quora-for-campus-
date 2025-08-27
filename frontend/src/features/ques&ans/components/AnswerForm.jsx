import React, { useState } from "react";
import { toast } from "react-toastify";
import UploadInput from "../../../components/common/UploadInput";

export default function AnswerForm({
  onSubmit,
  initialBody = "",
  initialAttachments = [],
  mode = "create",
}) {
  const [formData, setFormData] = useState({
    body: initialBody,
    attachments: Array.isArray(initialAttachments) ? initialAttachments : [],
  });

  const [previewImage, setPreviewImage] = useState(null); // for full view modal

  const handleFileUpload = (url) => {
    if (formData.attachments.length >= 10) {
      toast.error("You can only upload up to 10 attachments.");
      return;
    }

    const lower = url.toLowerCase();
    const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(lower);
    const type = isImage ? "image" : "document";

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { url, type }],
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = (formData.body || "").trim();
    const atts = Array.isArray(formData.attachments)
      ? formData.attachments
      : [];
    if (!body && atts.length === 0) {
      return toast.error("Answer cannot be empty");
    }
    await onSubmit({ body, attachments: atts });
    if (mode === "create") setFormData({ body: "", attachments: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        name="body"
        value={formData.body}
        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        placeholder="Write your answer..."
        className="w-full p-3 rounded-lg bg-[#374151] text-white resize-none"
        rows={4}
      />

      <UploadInput onUpload={handleFileUpload} />

      {/* Attachments Preview */}
      <div className="flex flex-col gap-4">
        {/* Image grid */}
        {formData.attachments.some((a) => a.type === "image") && (
          <div className="grid grid-cols-5 gap-2">
            {formData.attachments
              .filter((a) => a.type === "image")
              .map((att, i) => (
                <div key={i} className="relative">
                  <img
                    src={att.url}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-600"
                    onClick={() => setPreviewImage(att.url)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(i)}
                    className="absolute -top-2 -right-2 bg-black/70 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Document links */}
        <div className="flex flex-col gap-2">
          {formData.attachments
            .filter((a) => a.type === "document")
            .map((att, i) => (
              <div key={i} className="relative flex items-center">
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  📄 Document {i + 1}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(i)}
                  className="ml-2 text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Full image modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
      >
        {mode === "edit" ? "Update Answer" : "Post Answer"}
      </button>
    </form>
  );
}
