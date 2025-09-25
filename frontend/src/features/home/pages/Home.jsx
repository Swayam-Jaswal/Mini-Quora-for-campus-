import React from "react";
import Navbar from "../../../components/layout/Navbar";
import Announcements from "../../announcements/components/Announcements";
import QuickLinks from "../components/QuickLinks";
import UniversityUpdates from "../components/UniversityUpdates";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      <div className="flex flex-1 px-6 py-4 gap-6">
        <QuickLinks />

        <main className="flex-1 bg-black/20 rounded-2xl p-6 shadow-lg">
          <UniversityUpdates/>
        </main>

        <Announcements />
      </div>
    </div>
  );
}