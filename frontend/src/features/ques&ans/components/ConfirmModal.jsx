// src/components/ConfirmModal.jsx
import React from "react";
import Loader from "../../../components/common/Loader"; // ✅ Reusable loader

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmButton,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-4">{message}</p>

        <div className="flex justify-end space-x-3">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Confirm button */}
          {confirmButton ? (
            confirmButton
          ) : (
            <button
              onClick={onConfirm}
              disabled={loading}
              // ✅ Fixed width so it doesn’t resize
              className="px-4 py-2 min-w-[90px] bg-red-600 hover:bg-red-500 rounded-lg text-white flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader size="sm" /> 
                  <span className="ml-2">...</span>
                </>
              ) : (
                "Delete"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
