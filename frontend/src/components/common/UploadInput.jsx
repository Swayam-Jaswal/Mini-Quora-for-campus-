import React, { useState } from "react";
import axios from "axios";

export default function UploadInput({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      onUpload(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
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
