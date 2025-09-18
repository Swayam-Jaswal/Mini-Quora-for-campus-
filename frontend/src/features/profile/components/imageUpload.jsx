// src/features/profile/components/ImageUpload.jsx
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { updateProfile } from "../slices/profileSlice";
import { Pencil, Plus, Check } from "lucide-react";

export default function ImageUpload({
  field,
  avatars = [],
  activeAvatar,
  currentUrl,
  type = "circle",
  size = 112,
  height = 240,
  onAvatarSelect,
  onAvatarAdd,
  onBannerChange,
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleEditClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const uploaded = res?.data?.files?.[0];
      if (!uploaded?.url) {
        toast.error("Upload failed: no URL returned");
        return;
      }

      if (field === "avatars") {
        const newAvatars = [...avatars, uploaded.url];
        await dispatch(updateProfile({ avatars: newAvatars, activeAvatar: uploaded.url })).unwrap();
        toast.success("New profile picture added");
        onAvatarAdd && onAvatarAdd(newAvatars);
      } else if (field === "banner") {
        await dispatch(updateProfile({ banner: uploaded.url })).unwrap();
        toast.success("Banner updated");
        onBannerChange && onBannerChange(uploaded.url);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (e?.target) e.target.value = "";
    }
  };

  if (field === "avatars") {
    return (
      <div>
        <div className="flex gap-4 flex-wrap">
          {avatars.map((url, i) => (
            <div
              key={i}
              className={`relative cursor-pointer ${
                activeAvatar === url ? "ring-4 ring-blue-500 rounded-full" : ""
              }`}
              style={{ width: size, height: size }}
              onClick={() => onAvatarSelect(url)}
            >
              <img
                src={url}
                alt={`avatar-${i}`}
                className="w-full h-full rounded-full object-cover border"
              />
              {activeAvatar === url && (
                <Check className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 p-1" />
              )}
            </div>
          ))}

          {/* Upload new avatar */}
          <button
            type="button"
            onClick={handleEditClick}
            disabled={uploading}
            className="flex items-center justify-center w-[112px] h-[112px] rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            {uploading ? "..." : <Plus className="w-6 h-6" />}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  }

  // Banner Upload
  return (
    <div className="relative group" style={{ height: `${height}px`, width: "100%" }}>
      <img
        src={currentUrl}
        alt={field}
        className="w-full h-full object-cover rounded-xl"
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleEditClick}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30 rounded-xl"
      >
        {uploading ? (
          <span className="text-white text-sm">Uploading...</span>
        ) : (
          <Pencil className="text-white w-6 h-6" />
        )}
      </button>
    </div>
  );
}
