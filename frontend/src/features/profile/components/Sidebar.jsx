// src/features/profile/components/Sidebar.jsx
import { User, Settings, Shield } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Profile Overview", icon: <User size={18} /> },
    { id: "settings", label: "Account Settings", icon: <Settings size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  return (
    <aside className="w-64 bg-black/30 border-r border-gray-700 p-4 space-y-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition ${
            activeTab === t.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </aside>
  );
}
