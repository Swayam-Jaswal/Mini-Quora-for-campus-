import React, { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import UserManagement from "../components/UserManagement";
import CodeGenerator from "../components/CodeGenerator";
import SuperAdminManagement from "../components/SuperAdminManagement";
import AnnouncementsManager from "../../announcements/components/AnnouncementsManager";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";
  const [activeTab, setActiveTab] = useState("stats");

  // role helper
  const ROLE_ORDER = { user: 0, moderator: 1, admin: 2, superadmin: 3 };
  const isAtLeast = (requiredRole) =>
    ROLE_ORDER[role] >= ROLE_ORDER[requiredRole];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#29323C] to-[#485563] text-white">
      <Navbar />

      <div className="flex flex-1 px-6 py-4 gap-6">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role={role}
        />

        <main className="flex-1 bg-black/20 rounded-2xl p-6 shadow-lg overflow-y-auto">
          {/* Default Dashboard sections */}
          {activeTab === "stats" && <DashboardStats />}
          {activeTab === "requests" && (
            <div>Recruitment Requests Component</div>
          )}

          {/* ✅ Announcements (moderator/admin/superadmin) */}
          {isAtLeast("moderator") &&
            activeTab === "announcements" && <AnnouncementsManager />}

          {/* Admin & higher (admin + superadmin) */}
          {isAtLeast("admin") && activeTab === "codes" && <CodeGenerator />}
          {isAtLeast("admin") && activeTab === "users" && <UserManagement />}

          {/* Superadmin only */}
          {role === "superadmin" &&
            activeTab === "admins" && <SuperAdminManagement />}
        </main>
      </div>
    </div>
  );
}
