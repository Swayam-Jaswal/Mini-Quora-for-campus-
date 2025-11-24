// src/features/home/pages/updateCard.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../app/api";
import ConfirmActionModal from "../../../components/common/ConfirmActionModal";

function formatTimeAgo(date) {
  try {
    const now = new Date();
    const past = new Date(date);
    const diff = (now - past) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    return Math.floor(diff / 86400) + "d ago";
  } catch {
    return date;
  }
}

export default function UpdateCard({ item, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const auth = useSelector((s) => s.auth);
  const myId = auth?.user?._id;
  const role = String(auth?.user?.role || "").toLowerCase();

  const canDelete = ["admin", "moderator", "mod", "superadmin"].includes(role);

  const youLiked = item.likes?.some((id) => String(id) === String(myId));
  const likeCount = item.likes?.length || 0;

  const handleLike = async () => {
    try {
      setBusy(true);
      const { data } = await api.post(`/api/updates/${item._id}/like`);
      onChanged(data);
    } finally {
      setBusy(false);
    }
  };

  const deleteConfirmed = async () => {
    try {
      setBusy(true);
      await api.delete(`/api/updates/${item._id}`);
      onChanged({ _deleted: true, _id: item._id });
    } finally {
      setBusy(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="avatar">
          {item.author?.name
            ? item.author.name.slice(0, 2).toUpperCase()
            : "U"}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-white text-lg">
                {item.author?.name || "Unknown User"}
              </div>
              <div className="text-xs text-white/60">
                {formatTimeAgo(item.createdAt)}
              </div>
            </div>

            {/* Delete Button */}
            {canDelete && (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={busy}
                className="text-red-300 hover:text-red-400 text-sm transition"
              >
                Delete
              </button>
            )}
          </div>

          {/* Title */}
          {item.title && (
            <h4 className="mt-3 text-lg font-semibold text-white">
              {item.title}
            </h4>
          )}

          {/* Body */}
          {item.body && (
            <p className="mt-2 text-white/90 whitespace-pre-wrap leading-relaxed">
              {item.body}
            </p>
          )}

          {/* Images */}
          {!!item.images?.length && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="rounded-xl object-cover max-h-72 w-full shadow-md"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="card-actions mt-4 flex items-center justify-between">
            <button
              onClick={handleLike}
              disabled={busy}
              className={`flex items-center gap-2 text-sm transition ${
                youLiked ? "text-[#6c7cff]" : "text-white/70"
              }`}
            >
              ❤️ {likeCount}
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmActionModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={deleteConfirmed}
        title="Delete Update?"
        description="This action cannot be undone. Type DELETE to confirm."
        confirmWord="DELETE"
      />
    </div>
  );
}
