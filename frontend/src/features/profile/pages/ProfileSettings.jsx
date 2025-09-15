import { useDispatch } from "react-redux";
import { updateProfile } from "../slices/profileSlice";
import { useState } from "react";

export default function ProfileSettings({ profile }) {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    anonymousMode: profile.anonymousMode,
    privateProfile: profile.privateProfile,
  });

  const handleToggle = (field) => {
    const newValue = !settings[field];
    const updated = { ...settings, [field]: newValue };
    setSettings(updated);
    // 🔹 update backend immediately
    dispatch(updateProfile({ [field]: newValue }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      <div className="space-y-6">
        {/* Anonymous Mode */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
          <div>
            <h3 className="font-semibold">Anonymous Mode</h3>
            <p className="text-sm text-gray-400">
              Hide your name and profile in public areas.
            </p>
          </div>
          <button
            onClick={() => handleToggle("anonymousMode")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.anonymousMode ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform ${
                settings.anonymousMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Private Profile */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
          <div>
            <h3 className="font-semibold">Private Profile</h3>
            <p className="text-sm text-gray-400">
              Restrict access to your profile from other users.
            </p>
          </div>
          <button
            onClick={() => handleToggle("privateProfile")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.privateProfile ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform ${
                settings.privateProfile ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
