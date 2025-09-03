import React from "react";

export default function DocumentPreview({ url, name, onRemove }) {
  const isPDF = url.toLowerCase().endsWith(".pdf");
  const isWord =
    url.toLowerCase().endsWith(".doc") || url.toLowerCase().endsWith(".docx");

  return (
    <div className="relative border border-gray-600 rounded-md bg-gray-800 p-2 w-40 text-white">
      {/* Preview */}
      {isPDF ? (
        <iframe
          src={url}
          title={name || "PDF Document"}
          className="w-full h-40 rounded-md border border-gray-700"
        />
      ) : isWord ? (
        <div className="flex flex-col items-center justify-center h-40">
          <span className="text-4xl">📘</span>
          <p className="text-xs mt-2 truncate">{name || "Word Document"}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40">
          <span className="text-4xl">📄</span>
          <p className="text-xs mt-2 truncate">{name || "Document"}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center mt-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded"
        >
          View
        </a>
        <a
          href={url}
          download
          className="px-2 py-1 bg-green-600 hover:bg-green-500 text-xs rounded"
        >
          ⬇
        </a>
      </div>

      {/* Remove button (only in form mode) */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-black/70 text-white text-xs px-1 rounded"
        >
          ✕
        </button>
      )}
    </div>
  );
}
