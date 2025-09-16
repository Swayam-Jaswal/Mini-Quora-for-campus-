// src/features/profile/components/ProfileEditModal.jsx
import { useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../slices/profileSlice";

// ✅ Backend only allows name + bio (email not editable here)
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Too short"),
  bio: yup.string().max(300, "Bio must be 300 characters or less"),
});

export default function ProfileEditModal({ open, onClose }) {
  const dispatch = useDispatch();
  const openerRef = useRef(null);
  const { data, loading, error } = useSelector((s) => s.profile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", bio: "" },
  });

  // Populate form when modal opens
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      if (data) {
        reset({
          name: data.name || "",
          bio: data.bio || "",
        });
      }
    } else {
      // restore focus
      if (openerRef.current && typeof openerRef.current.focus === "function") {
        openerRef.current.focus();
      }
    }
  }, [open, data, reset]);

  if (!open) return null;

  const onSubmit = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      onClose();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <FocusLock returnFocus={true}>
          <h2 id="edit-profile-title" className="text-xl font-semibold mb-4">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                {...register("name")}
                className="mt-1 block w-full border rounded px-3 py-2"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p role="alert" className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                {...register("bio")}
                rows={4}
                className="mt-1 block w-full border rounded px-3 py-2"
                aria-invalid={errors.bio ? "true" : "false"}
              />
              {errors.bio && (
                <p role="alert" className="text-sm text-red-600 mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="text-sm text-red-600 mb-3">
                Failed to save: {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading || isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </FocusLock>
      </div>
    </div>
  );
}
