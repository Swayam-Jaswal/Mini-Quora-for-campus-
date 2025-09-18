// src/features/profile/components/Sidebar.jsx
import { User, Settings, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const tabs = [
    { to: "/profile", label: "Profile Overview", icon: <User size={18} />, end: true },
    { to: "/profile/settings", label: "Account Settings", icon: <Settings size={18} /> },
    { to: "/profile/security", label: "Security", icon: <Shield size={18} /> },
  ];

  return (
    <aside className="w-64 mr-4 -ml-2 bg-black/40 rounded-xl shadow-lg p-4 space-y-2 h-fit">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          {t.icon}
          {t.label}
        </NavLink>
      ))}
    </aside>
  );
}
