import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import UploadInput from "../../../components/common/UploadInput";
import Loader from "../../../components/common/Loader"; // existing loader

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

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const uploadTimeoutRef = useRef(null);

  // Sync when switching into edit mode
  useEffect(() => {
    if (mode === "edit") {
      setFormData({
        body: initialBody,
        attachments: Array.isArray(initialAttachments)
          ? initialAttachments
          : [],
      });
    }
  }, [mode, initialBody, initialAttachments]);

  // Cleanup any timeout on unmount
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
        uploadTimeoutRef.current = null;
      }
    };
  }, []);

  // File upload handler (called when UploadInput finishes an upload)
  const handleFileUpload = (fileData) => {
    // Defensive: make sure we hide loader if something is wrong
    try {
      if (!fileData || typeof fileData.url !== "string") {
        toast.error("Invalid file URL returned from server");
        console.error("Upload returned invalid data:", fileData);
        return;
      }

      if (formData.attachments.length >= 10) {
        toast.error("You can only upload up to 10 attachments.");
        return;
      }

      const lower = fileData.url.toLowerCase();
      const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(lower);
      const type = isImage ? "image" : "document";

      setFormData((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          { url: fileData.url, public_id: fileData.public_id, type },
        ],
      }));
    } finally {
      // Ensure we always clear uploading state when upload completes
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
        uploadTimeoutRef.current = null;
      }
      setUploading(false);
    }
  };

  // Remove attachment (local + backend sync in edit mode)
  const handleRemoveAttachment = async (index) => {
    const updatedAttachments = formData.attachments.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      attachments: updatedAttachments,
    }));

    if (mode === "edit" && typeof onSubmit === "function") {
      try {
        // Call parent's onSubmit to persist updated attachments
        await onSubmit({ body: formData.body, attachments: updatedAttachments });
        toast.success("Attachment removed successfully");
      } catch (err) {
        toast.error("Failed to remove attachment");
        console.error(err);
      }
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = (formData.body || "").trim();
    const atts = Array.isArray(formData.attachments)
      ? formData.attachments
      : [];

    if (!body && atts.length === 0) {
      return toast.error("Answer cannot be empty");
    }

    // Keep behavior same: call parent onSubmit
    await onSubmit({ body, attachments: atts });

    if (mode === "create") {
      setFormData({ body: "", attachments: [] });
    }
  };

  // Helper for file icons
  const getFileIcon = (url = "") => {
    const lower = String(url || "").toLowerCase();
    if (lower.endsWith(".pdf")) return "/icons/pdf.png";
    if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "/icons/word.png";
    if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "/icons/ppt.png";
    return "/icons/file.png";
  };

  // Called when UploadInput signals upload started
  const handleUploadStart = () => {
    // Show loader and set a fallback timeout to avoid stuck loader
    setUploading(true);
    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    uploadTimeoutRef.current = setTimeout(() => {
      setUploading(false);
      uploadTimeoutRef.current = null;
      console.warn("Upload timeout cleared automatically after 30s.");
    }, 30000); // 30s fallback
  };

  // Called when UploadInput signals upload finished (we also clear in handleFileUpload)
  const handleUploadComplete = () => {
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
      uploadTimeoutRef.current = null;
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 relative">
      <textarea
        name="body"
        value={formData.body}
        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        placeholder="Write your answer..."
        className="w-full p-3 rounded-lg bg-[#374151] text-white resize-none"
        rows={4}
      />

      {/* Only allow uploads in create mode */}
      {mode === "create" && (
        <UploadInput
          onUpload={handleFileUpload}
          onUploadStart={handleUploadStart}       // optional - UploadInput may call this
          onUploadComplete={handleUploadComplete} // optional - UploadInput may call this
        />
      )}

      {/* Unified Attachment Preview */}
      <div className="flex flex-wrap gap-3">
        {formData.attachments.map((att, i) => (
          <div key={i} className="relative">
            {att.type === "image" ? (
              <div
                className="w-20 h-20 flex flex-col items-center justify-center rounded-lg bg-slate-800 border border-gray-600 hover:scale-105 transition cursor-pointer overflow-hidden"
                onClick={() => setPreviewImage(att.url)}
              >
                <img src={att.url} alt="preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-20 h-20 flex flex-col items-center justify-center rounded-lg bg-slate-800 border border-gray-600 hover:bg-slate-700 hover:scale-105 transition cursor-pointer"
              >
                <img src={getFileIcon(att.url)} alt="file icon" className="w-8 h-8 object-contain" />
                <span className="mt-1 text-[10px] text-slate-300 truncate w-16 text-center">
                  {String(att.url).split("/").pop()}
                </span>
              </a>
            )}

            {/* Remove button */}
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

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Full Preview" className="max-w-full max-h-full rounded-lg shadow-lg" />
        </div>
      )}

      {/* Submit button */}
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500">
        {mode === "edit" ? "Update Answer" : "Post Answer"}
      </button>

      {/* Fullscreen loader overlay when uploading */}
      {uploading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 pointer-events-auto">
          <Loader size="lg" color="blue-500" text="Uploading file..." />
        </div>
      )}
    </form>
  );
}
