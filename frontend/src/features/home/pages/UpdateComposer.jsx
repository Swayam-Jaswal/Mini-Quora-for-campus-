// src/features/home/pages/UpdateComposer.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../app/api";

export default function UpdateComposer({ onPosted = () => {} }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const auth = useSelector((s) => s.auth);
  const token = auth?.token || localStorage.getItem("token");
  const role = String(auth?.user?.role || "").toLowerCase();

  const canPost = ["admin", "moderator", "mod", "superadmin"].includes(role);

  if (!canPost) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      const input = e.target.elements["images"];
      const files = input?.files ? Array.from(input.files) : [];

      let urls = [];

      if (files.length > 0) {
        const form = new FormData();
        files.forEach((file) => form.append("file", file)); // correct multer field

        const uploadRes = await api.post("/api/upload", form, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        urls = uploadRes.data.files.map((x) => x.url);
      }

      const res = await api.post(
        "/api/updates",
        { body: body.trim(), images: urls },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      onPosted(res.data);
      setBody("");
      if (input) input.value = "";
    } catch (err) {
      console.error("Error posting update:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel-glass rounded-2xl p-5 mb-6">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="avatar">
          {auth?.user?.name ? auth.user.name.slice(0, 2).toUpperCase() : "U"}
        </div>

        {/* Composer Body */}
        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share an update with your university..."
            className="w-full bg-transparent resize-none text-white placeholder:composer-placeholder input-focus"
            rows={3}
          />

          <div className="flex items-center justify-between mt-4">
            {/* Add Image */}
            <label className="text-sm text-white/75 cursor-pointer hover:text-white transition">
              <input type="file" name="images" className="hidden" multiple />
              <span className="inline-flex items-center gap-2">
                📷 Add Image
              </span>
            </label>

            {/* Post Button */}
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-[#5b66ff] to-[#b56bff] shadow-md hover:opacity-90 transition"
            >
              {busy ? "Posting..." : "Post Update"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
