// src/features/profile/pages/ProfileSettings.jsx
import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateProfile } from "../slices/profileSlice";
import ImageUpload from "../components/imageUpload";
import ProfileEditModal from "../components/ProfileEditModal";
import SkillsEditModal from "../components/SkillsEditModal";
import SocialLinkModal from "../components/SocialLinkModal";
import { socialPlatforms } from "../utils/Icons";
import { toast } from "react-toastify";
import FadeIn from "../components/FadeIn";
import React from "react";
import { useOutletContext } from "react-router-dom";

function ProfileSettings() {
  const { profile } = useOutletContext(); // ✅ get profile from parent Outlet
  const dispatch = useDispatch();

  const [editingField, setEditingField] = useState(null);
  const [editingPlatform, setEditingPlatform] = useState(null);

  const handleSave = async (field, value) => {
    try {
      await dispatch(updateProfile({ [field]: value })).unwrap();
      toast.success(`${field} updated`);
    } catch (err) {
      toast.error(`Failed to update ${field}`);
    } finally {
      setEditingField(null);
      setEditingPlatform(null);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {/* === Avatars Section === */}
      <FadeIn>
        <div className="bg-black/20 p-6 rounded-2xl">
          <h3 className="font-semibold mb-3">Profile Pictures</h3>
          <ImageUpload
            field="avatars"
            avatars={profile.avatars || []}
            activeAvatar={profile.activeAvatar}
            type="circle"
            size={128}
            onAvatarSelect={(url) => handleSave("activeAvatar", url)}
            onAvatarAdd={(avatars) => handleSave("avatars", avatars)}
          />
        </div>
      </FadeIn>

      {/* === Banner Upload === */}
      <FadeIn delay={0.1}>
        <div className="bg-black/20 p-6 rounded-2xl">
          <h3 className="font-semibold mb-3">Profile Banner</h3>
          <ImageUpload
            field="banner"
            currentUrl={profile.banner}
            type="rect"
            height={200}
            onBannerChange={(url) => handleSave("banner", url)}
          />
        </div>
      </FadeIn>

      {/* === Name & Tagline === */}
      <FadeIn delay={0.2}>
        <div className="bg-black/20 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Change Name</h3>
              <p className="text-gray-400">{profile.name}</p>
            </div>
            <button
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
              onClick={() => setEditingField("name")}
            >
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Edit Tagline</h3>
              <p className="text-gray-400 font-bold">
                {profile.tagline || "No tagline set"}
              </p>
            </div>
            <button
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
              onClick={() => setEditingField("tagline")}
            >
              Edit
            </button>
          </div>
        </div>
      </FadeIn>

      {/* === Bio === */}
      <FadeIn delay={0.3}>
        <div className="bg-black/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Edit Bio</h3>
            <p className="text-gray-400">{profile.bio || "No bio added yet"}</p>
          </div>
          <button
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
            onClick={() => setEditingField("bio")}
          >
            Edit
          </button>
        </div>
      </FadeIn>

      {/* === Skills === */}
      <FadeIn delay={0.4}>
        <div className="bg-black/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Edit Skills</h3>
            <p className="text-gray-400">
              {profile.skills?.length > 0
                ? profile.skills.join(", ")
                : "No skills added"}
            </p>
          </div>
          <button
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
            onClick={() => setEditingField("skills")}
          >
            Edit
          </button>
        </div>
      </FadeIn>

      {/* === Social Links === */}
      <FadeIn delay={0.5}>
        <div className="bg-black/20 p-6 rounded-2xl">
          <h3 className="font-semibold mb-3">Edit Social Links</h3>
          <div className="flex gap-4">
            {["github", "linkedin", "instagram"].map((platform) => {
              const config = socialPlatforms[platform];
              const Icon = config.icon;
              const link = profile.social?.[platform];

              return (
                <button
                  key={platform}
                  onClick={() => setEditingPlatform(platform)}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition"
                  title={link ? `Edit ${config.name}` : `Add ${config.name}`}
                >
                  {link ? (
                    <Icon size={20} className="text-white" />
                  ) : (
                    <span className="text-lg font-bold">+</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* === Anonymous Mode Button === */}
      <FadeIn delay={0.6}>
        <div className="bg-black/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Anonymous Mode</h3>
            <p className="text-gray-400 text-sm">
              {profile.anonymousMode
                ? "Your name will be hidden when posting"
                : "Your name will be visible"}
            </p>
          </div>
          <button
            onClick={() => handleSave("anonymousMode", !profile.anonymousMode)}
            className={`px-4 py-2 rounded font-bold transition ${
              profile.anonymousMode
                ? "bg-green-600 hover:bg-green-500"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {profile.anonymousMode ? "ON" : "OFF"}
          </button>
        </div>
      </FadeIn>

      {/* === Modals === */}
      {editingField && (
        <>
          {["name", "bio", "tagline"].includes(editingField) && (
            <ProfileEditModal
              open={true}
              field={editingField}
              currentValue={profile[editingField] || ""}
              onClose={() => setEditingField(null)}
              onSave={(val) => handleSave(editingField, val)}
            />
          )}
          {editingField === "skills" && (
            <SkillsEditModal
              open={true}
              initialSkills={profile.skills || []}
              onClose={() => setEditingField(null)}
              onSave={(val) => handleSave("skills", val)}
            />
          )}
        </>
      )}

      {editingPlatform && (
        <SocialLinkModal
          open={true}
          platform={editingPlatform}
          existingUrl={profile?.social?.[editingPlatform] || ""}
          onClose={() => setEditingPlatform(null)}
          onSave={(platform, val) => {
            const newSocial = { ...profile.social, [platform]: val };
            handleSave("social", newSocial);
          }}
        />
      )}
    </div>
  );
}

export default React.memo(ProfileSettings);
