import React, { useState } from "react";
import api from "../../../app/api";
import { toast } from "react-toastify";
import FadeIn from "../components/FadeIn";

function ProfileSecurity() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirm)
      return toast.error("New passwords do not match");
    setLoading(true);
    try {
      await api.put("/api/users/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="bg-black/20 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">Security</h3>
        <div className="grid grid-cols-1 gap-3 max-w-lg">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={handleChange}
            className="p-3 rounded bg-gray-800"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={form.newPassword}
            onChange={handleChange}
            className="p-3 rounded bg-gray-800"
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm new password"
            value={form.confirm}
            onChange={handleChange}
            className="p-3 rounded bg-gray-800"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              {loading ? "Saving..." : "Change password"}
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default React.memo(ProfileSecurity);
