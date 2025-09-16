// src/features/profile/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../components/layout/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileOverview from "./ProfileOverview";
import ProfileSettings from "./ProfileSettings";
import ProfileSecurity from "./ProfileSecurity";
import { fetchProfile } from "../slices/profileSlice";
import { socialPlatforms } from "../utils/Icons";
import FadeIn from "../components/FadeIn";

export default function Profile() {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector(
    (state) => state.profile
  );

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      {/* ===== Header Section ===== */}
      <div className="bg-black/50">
        {!loading && profile ? (
          <div
            className="w-full h-60 bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.banner})` }}
          />
        ) : (
          <div className="relative h-60 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        )}

        {!loading && profile && (
          <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 pb-8">
            <div className="flex items-end gap-6">
              {/* ✅ Avatar (no edit) */}
              <FadeIn>
                <div className="rounded-full shadow-lg shadow-black/40">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-44 h-44 rounded-full object-cover border-4 border-gray-800"
                  />
                </div>
              </FadeIn>

              {/* Name + Tagline + Role */}
              <FadeIn delay={0.1}>
                <div className="mt-20">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-gray-300 font-semibold text-yellow-500">
                    {profile.tagline || "No tagline added yet"}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400">
                    {profile.role}
                  </span>
                </div>
              </FadeIn>

              {/* Social Section */}
              <FadeIn delay={0.2} className="ml-auto mb-2 flex flex-col items-start">
                <span className="text-sm font-semibold tracking-wide text-gray-300 mb-4">
                  Follow me on
                </span>
                <div className="flex gap-4 items-center">
                  {["github", "linkedin", "instagram"].map((platform) => {
                    const config = socialPlatforms[platform];
                    const Icon = config.icon;
                    const link = profile.social?.[platform];
                    return (
                      link && (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition"
                        >
                          <Icon size={20} className="text-white" />
                        </a>
                      )
                    );
                  })}
                </div>
              </FadeIn>
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
    </div>
  );
}
