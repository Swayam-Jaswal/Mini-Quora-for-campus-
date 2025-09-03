// src/components/common/UploadInput.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * UploadInput
 * Props:
 *  - onUpload(fileObj)           // called once per uploaded file with { url, public_id, type }
 *  - onUploadStart?()            // optional hook when upload starts
 *  - onUploadComplete?()         // optional hook when upload finishes (success or fail)
 */
export default function UploadInput({ onUpload, onUploadStart, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    onUploadStart?.();

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("file", f)); // append multiple files under same field

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // CASE A: backend returns { files: [ { url, public_id }, ... ] }
      if (res?.data?.files && Array.isArray(res.data.files)) {
        for (const f of res.data.files) {
          const url = f.url || f.path || f.secure_url || "";
          const public_id = f.public_id || f.filename || f.publicId || "";
          if (!url) {
            console.warn("Upload returned file item missing url:", f);
            continue;
          }
          const lower = String(url).toLowerCase();
          const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(lower);
          const type = isImage ? "image" : "document";

          // preserve old logic: call onUpload individually
          onUpload?.({ url, public_id, type });
        }

        // done
      }
      // CASE B: backend returns single file { url, public_id }
      else if (res?.data?.url) {
        const url = res.data.url;
        const public_id = res.data.public_id || res.data.filename || "";
        const lower = String(url).toLowerCase();
        const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(lower);
        const type = isImage ? "image" : "document";

        onUpload?.({ url, public_id, type });
      } else {
        console.error("Upload returned invalid response:", res.data);
        toast.error("Invalid upload response from server");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      onUploadComplete?.();
      // reset file input so same files can be selected again if needed
      if (e?.target) e.target.value = "";
    }
  };

  return (
    <div>
      <input
        id="fileUpload"
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="fileUpload"
        className={`cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm inline-flex items-center gap-2 ${
          uploading ? "opacity-75 pointer-events-none" : ""
        }`}
      >
        {uploading ? "Uploading..." : "Attach File"}
      </label>
    </div>
  );
}
