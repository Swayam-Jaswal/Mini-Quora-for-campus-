import React from "react";
import { Users, FileText, Megaphone, KeyRound, LayoutDashboard } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, role }) {
  // Shared links
  const commonLinks = [
    { key: "stats", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Recruitment Requests", icon: FileText },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];

  // Admin-only links
  const adminLinks = [
    { key: "users", label: "User Management", icon: Users },
    { key: "codes", label: "Code Generator", icon: KeyRound },
  ];

  const links = role === "admin" ? [...commonLinks, ...adminLinks] : commonLinks;

  return (
    <aside className="w-64 bg-black/30 rounded-2xl p-4 shadow-lg flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-gray-300 mb-3">
        {role === "admin" ? "Admin Panel" : "Moderator Panel"}
      </h2>
      {links.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl transition text-gray-200
            ${activeTab === key ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}
