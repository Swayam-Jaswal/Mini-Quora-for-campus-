// src/features/profile/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../components/layout/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileOverview from "./ProfileOverview";
import ProfileSettings from "./ProfileSettings";
import ProfileSecurity from "./ProfileSecurity";
import SocialLinkModal from "../components/SocialLinkModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import ImageUpload from "../components/imageUpload";
import { fetchProfile, updateProfile } from "../slices/profileSlice";
import { socialPlatforms, uiIcons } from "../utils/Icons";
import { toast } from "react-toastify";

export default function Profile() {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector(
    (state) => state.profile
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleSaveSocial = (platform, url) => {
    const trimmed = (url || "").trim();

    if (trimmed) {
      let finalUrl = trimmed;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }

      const validator = socialPlatforms[platform]?.validator;
      if (validator && !validator(finalUrl)) {
        toast.error(`Please enter a valid ${platform} link`);
        return;
      }

      const existing = profile?.social || {};
      const merged = { ...existing, [platform]: finalUrl };
      const cleaned = Object.fromEntries(
        Object.entries(merged).filter(([_, v]) => v)
      );

      dispatch(updateProfile({ social: cleaned }));
      toast.success(`${platform} link updated`);
    } else {
      dispatch(updateProfile({ social: { [platform]: "" } }));
      toast.success(`${platform} link removed`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      {/* ===== Header Section ===== */}
      <div className="bg-black/50">
        {!loading && profile ? (
          <ImageUpload
            field="banner"
            currentUrl={profile.banner}
            type="rect"
            height={240}
          />
        ) : (
          <div className="relative h-60 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        )}

        {!loading && profile && (
          <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 pb-8">
            <div className="flex items-end gap-6">
              {/* ✅ Avatar Upload */}
              <ImageUpload
                field="avatar"
                currentUrl={profile.avatar}
                type="circle"
                size={176}
              />

              {/* Name + Email + Role */}
              <div className="mt-20">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-gray-300">{profile.email}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400">
                  {profile.role}
                </span>
              </div>

              {/* Social Section */}
              <div className="ml-auto mb-2 flex flex-col items-start">
                {/* ✅ Label above icons */}
                <span className="text-sm font-semibold tracking-wide text-gray-300 mb-4">
                  Follow me on
                </span>

                <div className="flex gap-4 items-center">
                  {["github", "linkedin", "instagram"].map((platform) => {
                    const config = socialPlatforms[platform];
                    const Icon = config.icon;
                    const link = profile.social?.[platform];
                    const CloseIcon = uiIcons.close;

                    return (
                      <div key={platform} className="relative group">
                        <button
                          onClick={() =>
                            link
                              ? window.open(link, "_blank")
                              : setEditingPlatform(platform)
                          }
                          title={
                            link
                              ? `Open ${config.name}`
                              : `Add ${config.name} link`
                          }
                          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition"
                        >
                          {link ? (
                            <Icon size={20} className="text-white" />
                          ) : (
                            <span className="text-gray-300 text-lg font-bold">
                              +
                            </span>
                          )}
                        </button>

                        {link && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmRemove(platform);
                            }}
                            title="Remove link"
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full 
                                       bg-red-600 hover:bg-red-500 text-white 
                                       flex items-center justify-center text-xs shadow 
                                       opacity-0 group-hover:opacity-100 transition"
                          >
                            <CloseIcon size={10} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 pl-6">
          {loading && <p className="text-gray-400">Loading profile...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          {!loading && profile && (
            <>
              {activeTab === "overview" && (
                <ProfileOverview profile={profile} />
              )}
              {activeTab === "settings" && (
                <ProfileSettings profile={profile} />
              )}
              {activeTab === "security" && <ProfileSecurity />}
            </>
          )}
        </div>
      </main>

      {/* ===== Social Link Modal ===== */}
      {editingPlatform && (
        <SocialLinkModal
          open={!!editingPlatform}
          onClose={() => setEditingPlatform(null)}
          platform={editingPlatform}
          onSave={handleSaveSocial}
          existingUrl={profile?.social?.[editingPlatform] || ""}
        />
      )}

      {/* ===== Confirm Remove Modal ===== */}
      {confirmRemove && (
        <ConfirmModal
          open={!!confirmRemove}
          title="Remove Social Link"
          message={`Are you sure you want to remove your ${confirmRemove} link?`}
          onConfirm={() => {
            handleSaveSocial(confirmRemove, "");
            setConfirmRemove(null);
          }}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  );
}
