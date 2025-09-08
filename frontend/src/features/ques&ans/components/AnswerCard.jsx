import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAnswer, updateAnswer } from "../slices/answerSlice";
import AnswerModal from "./AnswerModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import TimeAgo from "../../../components/common/TimeAgo";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { Download } from "lucide-react";

export default function AnswerCard({
  id,
  body,
  author,
  isAnonymous,
  attachments = [],
  date,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const menuRef = useRef(null);

  const userId =
    user?._id || user?.id || user?.userId || user?.user?.id || user?.user?._id;
  const authorId =
    typeof author === "string" ? author : author?._id || author?.id;
  const isAuthor =
    Boolean(userId && authorId) && String(userId) === String(authorId);

  const handleUpdate = async (data) => {
    await dispatch(updateAnswer({ id, ...data }));
    setEditOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteAnswer(id)).unwrap();
      toast.success("Answer deleted successfully");
    } catch {
      toast.error("Failed to delete answer");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ File placeholder icons
  const getFileIcon = (url = "") => {
    const lower = url.toLowerCase();
    if (lower.endsWith(".pdf")) return "/icons/pdf.png";
    if (lower.endsWith(".doc") || lower.endsWith(".docx"))
      return "/icons/word.png";
    if (lower.endsWith(".ppt") || lower.endsWith(".pptx"))
      return "/icons/ppt.png";
    return "/icons/document.png";
  };

  // ✅ Force download link for Cloudinary
  const getDownloadUrl = (url = "") => {
    if (!url) return url;
    return url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;
  };

  return (
    <div className="flex-1 rounded-lg p-3 border-b border-gray-700 group transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white">
            {isAnonymous ? "Anonymous" : author?.name}
          </p>
          <p className="text-gray-200 mt-1">{body}</p>

          {attachments?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {attachments.map((att, i) =>
                att.type === "image" ? (
                  <div
                    key={i}
                    className="w-24 h-24 relative rounded-md border border-gray-600 overflow-hidden"
                  >
                    <img
                      src={att.url}
                      alt="attachment"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setPreviewImage(att.url)}
                    />

                    {/* ✅ Download button for images */}
                    <a
                      href={getDownloadUrl(att.url)}
                      download
                      className="absolute bottom-1 right-1 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-full"
                      title="Download image"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download size={14} />
                    </a>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="w-24 h-24 relative rounded-md border border-gray-600 overflow-hidden bg-slate-800 hover:bg-slate-700 transition"
                  >
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={getFileIcon(att.url)}
                        alt="document preview"
                        className="w-full h-full object-cover"
                      />
                    </a>

                    {/* ✅ Download button for docs */}
                    <a
                      href={getDownloadUrl(att.url)}
                      download
                      className="absolute bottom-1 right-1 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-full"
                      title="Download file"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className="p-2 rounded-full text-gray-400 hover:bg-[#374151] hover:text-white opacity-0 group-hover:opacity-100 transition"
            onClick={() => setMenuOpen((prev) => !prev)}
            title="See options"
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-[#374151] text-white rounded-lg shadow-lg z-10">
              {isAuthor ? (
                <>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[#4b5563]"
                    onClick={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[#4b5563]"
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#4b5563]"
                  onClick={() => setMenuOpen(false)}
                >
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start mt-2">
        <p className="text-xs text-gray-400">
          <TimeAgo date={date} />
        </p>
      </div>

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

      <AnswerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initialBody={body}
        initialAttachments={attachments}
        mode="edit"
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Answer"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      >
        {deleting && (
          <div className="mt-3 flex justify-center">
            <Loader size="sm" text="Deleting..." />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
