import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar";
import ProfileOverview from "./ProfileOverview";
import ProfileSettings from "./ProfileSettings";
import ProfileSecurity from "./ProfileSecurity";
import { fetchProfile } from "../slices/profileSlice";

export default function ProfileLayout() {
  const dispatch = useDispatch();
  const [active, setActive] = useState("overview");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      {/* reuse your Navbar somewhere above in app shell */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="flex gap-6">
          <Sidebar active={active} setActive={setActive} />

          <div className="flex-1">
            {active === "overview" && <ProfileOverview />}
            {active === "settings" && <ProfileSettings />}
            {active === "security" && <ProfileSecurity />}
            {active === "activity" && (
              <div className="bg-black/20 p-6 rounded-2xl">
                Activity tab - coming soon
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
