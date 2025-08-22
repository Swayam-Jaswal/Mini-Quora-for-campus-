import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoreVertical, MessageCircle } from "lucide-react";
import { deleteQuestion, updateQuestion } from "../slices/questionSlice";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import EditModal from "./EditModal";

export default function QuestionCard({
  id,
  title,
  body,
  tags,
  authorId,
  answersCount = 0,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.questions);

  const handleDelete = () => {
    dispatch(deleteQuestion(id))
      .unwrap()
      .then(() => toast.success("Question deleted successfully"))
      .catch((err) => toast.error(err || "Failed to delete question"))
      .finally(() => setConfirmOpen(false));
  };

  const handleUpdate = (data) => {
    dispatch(updateQuestion({ id, data }))
      .unwrap()
      .then(() => {
        toast.success("Question updated successfully");
        setEditOpen(false);
      })
      .catch((err) => toast.error(err || "Failed to update question"));
  };

  const handleReport = () => {
    toast.info("Question reported. Our moderators will review it.");
    setMenuOpen(false);
  };

  const isAuthor = user?.id === authorId;

  return (
    <div className="bg-gray-900/60 border-l-4 border-red-500 p-4 rounded-lg shadow mb-4 relative">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3
          onClick={() => navigate(`/qna/${id}`)}
          className="text-lg font-semibold text-red-400 cursor-pointer hover:underline"
        >
          {title}
        </h3>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-white/10"
          >
            <MoreVertical className="w-5 h-5 text-gray-300" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              {isAuthor ? (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmOpen(true);
                    }}
                    className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReport}
                  className="block px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 w-full text-left"
                >
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-300 mt-2 line-clamp-3">{body}</p>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          onClick={() => navigate(`/qna/${id}`)}
          className="text-blue-400 hover:underline"
        >
          View all {answersCount} {answersCount === 1 ? "answer" : "answers"}
        </button>

        <button
          onClick={() => navigate(`/qna/${id}#reply`)}
          className="flex items-center gap-1 text-green-400 hover:underline"
        >
          <MessageCircle size={16} /> Reply
        </button>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Edit Modal */}
      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={{ title, body, tags }}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
}
