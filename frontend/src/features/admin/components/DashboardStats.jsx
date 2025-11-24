import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../slices/adminSlice";
import Loader from "../../../components/common/Loader";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

export default function DashboardStats() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading || !stats) return <Loader text="Loading stats..." />;

  const cards = [
    { title: "Users", value: stats.usersCount },
    { title: "Pending Requests", value: stats.pendingRequests },
    { title: "Announcements", value: stats.announcementsCount },
    { title: "Questions", value: stats.questionsCount },
  ];

  // BAR CHART
  const barChartData = [
    { name: "Users", count: stats.usersCount },
    { name: "Questions", count: stats.questionsCount },
    { name: "Answers", count: stats.answersCount },
    { name: "Announcements", count: stats.announcementsCount },
    { name: "Pending Req", count: stats.pendingRequests },
  ];

  // PIE CHART — Users by role
  const usersByRoleData = Object.keys(stats.usersByRole).map((role) => ({
    name: role,
    value: stats.usersByRole[role],
  }));

  const roleColors = ["#6c7cff", "#b56bff", "#4adcff", "#ff886c", "#ffd36c"];

  // LINE CHART — Questions per day (last 7 days)
  const questionsPerDay = stats.questionsPerDay.map((d) => ({
    date: d._id,
    count: d.count,
  }));

  return (
    <div className="space-y-10">

      {/* TOP CARDS */}
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

      {/* BAR CHART */}
      <div className="bg-black/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Platform Statistics Overview</h2>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} barSize={45}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "1px solid #444" }} />
              <Legend />
              <Bar dataKey="count" fill="#6c7cff" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="bg-black/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Users by Role</h2>

        <div className="w-full h-80 flex items-center justify-center">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={usersByRoleData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                innerRadius={60}
                label
              >
                {usersByRoleData.map((_, i) => (
                  <Cell key={i} fill={roleColors[i % roleColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "1px solid #444" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="bg-black/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Questions Growth (Last 7 Days)</h2>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={questionsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "1px solid #444" }} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#b56bff" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
