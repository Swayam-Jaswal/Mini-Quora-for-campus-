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
  const [showTooltip, setShowTooltip] = useState(false);

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

  // 🔹 Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="bg-[#1f2937] p-4 rounded-lg shadow-md mb-3">
      <div className="flex justify-between items-start">
        {/* Left side: Username above body */}
        <div>
          <p className="text-sm font-medium text-gray-200 mb-2">
            {isAnonymous ? "Anonymous" : author?.name}
          </p>
          <p className="text-gray-300 font-normal">{body}</p>
        </div>

        {/* Right side: Menu + Date */}
        <div className="flex flex-col items-end" ref={menuRef}>
          <div className="relative flex flex-col items-center">
            {/* Three dots button */}
            <button
              className="p-1.5 mt-[-4px] mr-[-2px] rounded-full text-gray-400 hover:bg-[#374151] hover:text-white"
              onClick={() => setMenuOpen((prev) => !prev)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ⋮
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                See options
              </div>
            )}

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#374151] text-white rounded-lg shadow-lg z-10 animate-fadeIn">
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

          {/* Date just below menu */}
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>

      {/* Edit Answer Modal */}
      <AnswerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initialBody={body}
        mode="edit"
      />

      {/* Confirm Delete Modal */}
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
