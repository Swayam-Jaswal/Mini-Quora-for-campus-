import React, { useState } from "react";
import UploadInput from "../../../components/common/UploadInput"; // reusable
import { useDispatch } from "react-redux";
import { updateProfile } from "../slices/profileSlice";
import Loader from "../../../components/common/Loader";

export default function AvatarUpload({ currentAvatar }) {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    // file: { url, public_id, type }
    setUploading(true);
    try {
      await dispatch(updateProfile({ avatar: file.url })).unwrap();
    } catch (err) {
      console.error("Failed to update avatar", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600">
        <img
          src={currentAvatar || "/default-avatar.png"}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center gap-2">
        <UploadInput
          onUpload={handleUpload}
          onUploadStart={() => setUploading(true)}
          onUploadComplete={() => setUploading(false)}
        />
        {uploading && <Loader size="sm" text="Uploading" />}
      </div>
    </div>
  );
}
