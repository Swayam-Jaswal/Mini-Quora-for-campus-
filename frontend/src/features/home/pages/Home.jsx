// src/features/home/pages/Home.jsx
import React from "react";
import Navbar from "../../../components/layout/Navbar";
import Announcements from "../../announcements/components/Announcements";
import UniversityUpdates from "./UniversityUpdates";
import QuickLinks from "../components/QuickLinks"; // <-- added

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f1724] to-[#0c1623] text-white">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 px-6 py-8 gap-6">

        {/* Left Sidebar */}
        <aside className="w-64 hidden lg:block">
          <div className="space-y-6">
            {/* Quick Links (functional now!) */}
            <QuickLinks />

            {/* AI Assistant Promo */}
            <div className="panel p-5 rounded-2xl">
              <div className="text-white font-semibold text-lg">
                AI Assistant
              </div>
              <div className="text-sm text-white/70 mt-2">
                Get instant answers to your academic questions.
              </div>
              <button className="w-full bg-gradient-to-r from-[#5b66ff] to-[#b56bff] text-white py-2 rounded-2xl mt-4 font-semibold">
                Try Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 min-w-0">
          <UniversityUpdates />
        </main>

        {/* Right Sidebar */}
        <Announcements />
      </div>
    </div>
  );
}
