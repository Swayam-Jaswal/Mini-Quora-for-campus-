import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../slices/adminSlice";
import Loader from "../../../components/common/Loader";

export default function DashboardStats() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading || !stats) return <Loader text="Loading stats..." />;

  const cards = [
    { title: "Users", value: stats.usersCount },
    { title: "Requests", value: stats.pendingRequests },
    { title: "Announcements", value: stats.announcementsCount ?? 0 },
    { title: "Questions", value: stats.questionsCount },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className="bg-black/30 p-6 rounded-2xl shadow text-center hover:bg-black/40 transition"
        >
          <h3 className="text-lg font-medium">{c.title}</h3>
          <p className="text-3xl font-bold mt-2">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
