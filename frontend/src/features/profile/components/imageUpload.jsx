// src/features/profile/components/ImageUpload.jsx
import React, { useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { updateProfile } from "../slices/profileSlice";
import { Pencil } from "lucide-react";
import Cropper from "react-easy-crop";

export default function ImageUpload({
  field,
  currentUrl,
  type = "circle",
  size = 112,
  height = 240,
}) {
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleEditClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  // process banner auto resize
  const processBanner = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const targetWidth = 1584;
        const targetHeight = 396;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const scale = Math.max(
          targetWidth / img.width,
          targetHeight / img.height
        );

        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const x = (targetWidth - newWidth) / 2;
        const y = (targetHeight - newHeight) / 2;

        ctx.drawImage(img, x, y, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Failed to process banner");
              return;
            }
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject("Invalid image file");
      img.src = URL.createObjectURL(file);
    });
  };

  // get cropped image blob
  const getCroppedImg = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = cropImage;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          400,
          400
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject("Crop failed");
            return;
          }
          resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        }, "image/jpeg");
      };
      image.onerror = reject;
    });
  }, [cropImage, croppedAreaPixels]);

  const handleFileChange = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (field === "avatar") {
      // show crop modal instead of uploading immediately
      setCropImage(URL.createObjectURL(file));
      setShowCrop(true);
      return;
    }

    try {
      setUploading(true);

      if (field === "banner") {
        file = await processBanner(file);
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const uploaded = res?.data?.files?.[0];
      if (!uploaded?.url) {
        toast.error("Upload failed: no URL returned");
        return;
      }

      setPreview(uploaded.url);
      await dispatch(updateProfile({ [field]: uploaded.url })).unwrap();

      toast.success(
        field === "avatar" ? "Profile picture updated" : "Banner updated"
      );
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(`Failed to upload ${field}`);
    } finally {
      setUploading(false);
      if (e?.target) e.target.value = "";
    }
  };

  const handleCropSave = async () => {
    try {
      setUploading(true);
      const croppedFile = await getCroppedImg();

      const formData = new FormData();
      formData.append("file", croppedFile);

      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const uploaded = res?.data?.files?.[0];
      if (!uploaded?.url) {
        toast.error("Upload failed: no URL returned");
        return;
      }

      setPreview(uploaded.url);
      await dispatch(updateProfile({ avatar: uploaded.url })).unwrap();

      toast.success("Profile picture updated");
      setShowCrop(false);
    } catch (err) {
      console.error("Crop upload error:", err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const containerStyle =
    type === "circle"
      ? { width: `${size}px`, height: `${size}px` }
      : { height: `${height}px`, width: "100%" };

  return (
    <>
      <div className="relative group" style={containerStyle}>
        <img
          src={preview}
          alt={field}
          className={
            type === "circle"
              ? "w-full h-full rounded-full object-cover border"
              : "w-full h-full object-cover"
          }
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* hover edit icon only */}
        <button
          type="button"
          onClick={handleEditClick}
          className={`absolute inset-0 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition 
                      ${type === "circle" ? "rounded-full" : ""}`}
        >
          {uploading ? (
            <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
              Uploading...
            </span>
          ) : (
            <Pencil className="text-white w-6 h-6 bg-black/60 p-1 rounded-full" />
          )}
        </button>
      </div>

      {/* Crop Modal for Avatar */}
      {showCrop && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[400px] h-[500px] flex flex-col">
            <div className="flex-1 relative">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowCrop(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
