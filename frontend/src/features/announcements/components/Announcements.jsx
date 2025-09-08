import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncements } from "../slice/announcementsSlice";
import { AlertTriangle, FileText, Info } from "lucide-react";

const iconMap = {
  alert: <AlertTriangle size={18} className="text-red-400" />,
  deadline: <FileText size={18} className="text-yellow-400" />,
  info: <Info size={18} className="text-blue-400" />, // ✅ Changed from Wifi → Info
};

export default function Announcements() {
  const dispatch = useDispatch();
  const { items: announcements, loading } = useSelector(
    (state) => state.announcements
  );

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  return (
    <aside className="w-1/4 bg-black/20 rounded-2xl p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">Announcements</h2>
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {announcements.map((item) => (
            <li key={item._id} className="flex items-center gap-2 text-gray-200">
              {iconMap[item.type] || iconMap.info}
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
