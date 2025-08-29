// src/components/common/UploadInput.jsx
import React, { useState } from "react";
import axios from "axios";

export default function UploadInput({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res?.data?.url) {
        onUpload?.(res.data);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
      >
        {uploading ? "Uploading..." : "Attach File"}
      </label>
    </div>
  );
}
