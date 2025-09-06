import React, { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import UserManagement from "../components/UserManagement";
import CodeGenerator from "../components/CodeGenerator";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      <div className="flex flex-1 px-6 py-4 gap-6">
        {/* Sidebar with role-specific links */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />

        {/* Main content */}
        <main className="flex-1 bg-black/20 rounded-2xl p-6 shadow-lg overflow-y-auto">
          {/* Both roles see Stats */}
          {activeTab === "stats" && <DashboardStats />}

          {activeTab === "requests" && <div>Recruitment Requests Component</div>}
          {activeTab === "announcements" && <div>Announcements Manager Component</div>}

          {/* Admin-only */}
          {role === "admin" && activeTab === "codes" && <CodeGenerator />}
          {role === "admin" && activeTab === "users" && <UserManagement />}
          {role === "admin" && activeTab === "codes" && <div></div>}
        </main>
      </div>
    </div>
  );
}
