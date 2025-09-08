import React from "react";
import { Users, FileText, Megaphone, KeyRound, LayoutDashboard } from "lucide-react";
import { isAtLeast } from "../../../utils/roles"; // adjust path

export default function Sidebar({ activeTab, setActiveTab, role = "user" }) {
  const commonLinks = [
    { key: "stats", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Recruitment Requests", icon: FileText },
    { key: "announcements", label: "Announcements", icon: Megaphone },
  ];

  const adminLinks = [
    { key: "users", label: "User Management", icon: Users },
    { key: "codes", label: "Code Generator", icon: KeyRound },
  ];

  const superAdminLinks = [{ key: "admins", label: "Admins", icon: Users }];

  const links = [
    ...commonLinks,
    ...(isAtLeast(role, "admin") ? adminLinks : []),
    ...(role === "superadmin" ? superAdminLinks : []),
  ];

  return (
    <aside className="w-64 p-4 bg-transparent">
      <h2 className="text-lg font-semibold mb-3">Admin</h2>
      {links.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl transition text-gray-200 w-full text-left mb-2
            ${activeTab === key ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}
