import { AlertTriangle, FileText, Wifi } from "lucide-react";

export default function Announcements() {
  const announcements = [
    { id: 1, icon: <AlertTriangle size={18} className="text-red-400" />, text: "Campus closed on Saturday for maintenance" },
    { id: 2, icon: <FileText size={18} className="text-yellow-400" />, text: "Deadline for scholarship forms: Aug 30" },
    { id: 3, icon: <Wifi size={18} className="text-green-400" />, text: "New WiFi access points installed in library" },
  ];

  return (
    <aside className="w-1/4 bg-black/20 rounded-2xl p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Announcements</h2>
      <ul className="space-y-3 text-sm">
        {announcements.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            {item.icon}
            {item.text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
