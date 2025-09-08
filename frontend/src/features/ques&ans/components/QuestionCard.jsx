import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoreVertical, UserCircle2 } from "lucide-react";
import { deleteQuestion, updateQuestion } from "../slices/questionSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/common/ConfirmModal";
import EditModal from "../../../components/common/EditModal";
import TimeAgo from "../../../components/common/TimeAgo";

export default function QuestionCard({
  id,
  title,
  body,
  tags,
  authorId,
  answersCount = 0,
  createdAt,
  authorName,
  showFooter = true,
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
    <div className="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow-md mb-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <UserCircle2 className="w-9 h-9 text-gray-400" />
          <div>
            <h4 className="text-sm font-semibold text-white">
              {isAuthor ? "You" : authorName || "Anonymous User"}
            </h4>
            <p className="text-xs text-gray-400">
              Asked <TimeAgo date={createdAt} />
            </p>
          </div>
        </div>

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

      <h3
        onClick={() => navigate(`/qna/${id}`)}
        className="text-xl font-bold text-blue-400 cursor-pointer hover:underline mb-2"
      >
        {title}
      </h3>

      <p className="text-gray-300 text-sm mb-3 line-clamp-3">{body}</p>

      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {showFooter && (
        <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-3">
          <button
            onClick={() => navigate(`/qna/${id}`)}
            className="text-green-400 hover:underline"
          >
            Answer
          </button>
          <p className="text-gray-400">
            {answersCount} Answer{answersCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

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
