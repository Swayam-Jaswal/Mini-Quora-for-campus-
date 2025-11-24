// src/features/announcements/components/Announcements.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncements,
  addAnnouncement,
} from "../slice/announcementsSlice";
import { socket } from "../../../app/socket";
import { AlertTriangle, FileText, Info } from "lucide-react";
import TimeAgo from "../../../components/common/TimeAgo";

const iconMap = {
  alert: <AlertTriangle size={18} className="text-sky-300" />,
  deadline: <FileText size={18} className="text-violet-300" />,
  info: <Info size={18} className="text-sky-300" />,
};

export default function Announcements() {
  const dispatch = useDispatch();
  const { items: announcements, loading } = useSelector(
    (s) => s.announcements
  );

  useEffect(() => {
    dispatch(fetchAnnouncements());

    socket.on("announcement:new", (announcement) => {
      dispatch(addAnnouncement(announcement));
    });

    return () => socket.off("announcement:new");
  }, [dispatch]);

  return (
    <aside className="w-80 hidden lg:block">
      <h2 className="text-xl font-semibold text-white mb-4">Announcements</h2>

      <div className="space-y-4">
        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-white/60">No announcements</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a._id}
              className="panel rounded-2xl p-5 shadow-card hover:bg-white/5 transition"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  {iconMap[a.type] || iconMap.info}
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90 truncate">
                    {a.title || a.text}
                  </p>

                  <p className="text-xs text-white/60 mt-1 line-clamp-2">
                    {a.description || a.text}
                  </p>

                  <span className="text-xs text-white/50 block mt-1">
                    <TimeAgo date={a.createdAt} />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
