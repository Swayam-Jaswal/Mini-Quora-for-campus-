// src/features/profile/pages/ProfileSettings.jsx
import { useDispatch } from "react-redux";
import { updateProfile } from "../slices/profileSlice";
import { useState } from "react";

export default function ProfileSettings({ profile }) {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    anonymousMode: profile.anonymousMode,
    privateProfile: profile.privateProfile,
  });

  const handleSave = () => {
    dispatch(updateProfile(settings));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.anonymousMode}
            onChange={(e) => setSettings({ ...settings, anonymousMode: e.target.checked })}
          />
          Enable Anonymous Mode
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.privateProfile}
            onChange={(e) => setSettings({ ...settings, privateProfile: e.target.checked })}
          />
          Make Profile Private
        </label>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
      >
        Save Settings
      </button>
    </div>
  );
}
