// src/features/profile/components/ProfileAvatarUpload.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProfileAvatarUpload({ current, onChange }) {
  const [uploading, setUploading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const url = res.data?.url || res.data?.files?.[0]?.url;
      if (url) {
        onChange(url);
        toast.success("Profile picture updated");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <img
        src={current}
        alt="avatar"
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-500"
        onError={(e) => (e.target.src = "/default-avatar.png")}
      />
      <label
        className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm ${
          uploading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Change Profile Picture"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
