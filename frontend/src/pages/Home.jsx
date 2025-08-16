import React from "react";
import Navbar from "../components/layout/Navbar";
import Announcements from "../components/layout/Announcements";
import { PartyPopper, Megaphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      {/* Navbar */}
      <Navbar />

      {/* 3 Column Layout */}
      <div className="flex flex-1 px-6 py-4 gap-6">
        
        {/* Left Panel */}
        <aside className="w-1/5 bg-black/20 rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li><button className="w-full text-left hover:text-gray-300">Dashboard</button></li>
            <li><button className="w-full text-left hover:text-gray-300">My Questions</button></li>
            <li><button className="w-full text-left hover:text-gray-300">AI Assistant</button></li>
          </ul>
        </aside>

        {/* Middle Panel */}
        <main className="flex-1 bg-black/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">University Updates</h2>
          
          {/* Example Update Cards */}
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-xl shadow">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <PartyPopper size={20} className="text-pink-400" />
                Freshers Party Announced
              </h3>
              <p className="text-sm text-gray-300">
                Join us this Friday for the annual freshers event at the main auditorium.
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-xl shadow">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Megaphone size={20} className="text-blue-400" />
                Mid-Sem Exams Schedule
              </h3>
              <p className="text-sm text-gray-300">
                The timetable for mid-sems has been released. Check the notice board for details.
              </p>
            </div>
          </div>
        </main>

        {/* Right Panel (Reusable Component) */}
        <Announcements />
      </div>
    </div>
  );
}
