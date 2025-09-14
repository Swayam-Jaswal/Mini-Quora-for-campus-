import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../components/layout/Navbar";
import { fetchProfile } from "../slices/profileSlice";
import Sidebar from "../components/Sidebar";
import ProfileOverview from "./ProfileOverview";
import ProfileSettings from "./ProfileSettings";
import ProfileSecurity from "./ProfileSecurity";
import { useState } from "react";

export default function Profile() {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "settings" | "security"

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />
      <main className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && <p className="text-gray-400">Loading profile...</p>}

          {!loading && profile && (
            <>
              {activeTab === "overview" && <ProfileOverview profile={profile} />}
              {activeTab === "settings" && <ProfileSettings profile={profile} />}
              {activeTab === "security" && <ProfileSecurity />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
