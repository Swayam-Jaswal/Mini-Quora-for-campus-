import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAnswer, updateAnswer } from "../slices/answerSlice";
import AnswerModal from "./AnswerModal";
import ConfirmModal from "../components/ConfirmModal";

export default function AnswerCard({ id, body, author, isAnonymous, date }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
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
    await dispatch(deleteAnswer(id));
    setConfirmOpen(false);
    setMenuOpen(false);
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

  return (
    <div className="flex-1 rounded-lg p-3 border-b border-gray-700 group transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white">
            {isAnonymous ? "Anonymous" : author?.name}
          </p>
          <p className="text-gray-200 mt-1">{body}</p>
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
        <p className="text-xs text-gray-400">{date}</p>
      </div>

      <AnswerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initialBody={body}
        mode="edit"
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Answer"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
