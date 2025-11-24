// src/features/home/components/UniversityUpdates.jsx

import { useEffect, useState } from "react";
import api from "../../../app/api";
import UpdateComposer from "../pages/UpdateComposer";
import UpdateCard from "../pages/updateCard";
import { useSelector } from "react-redux";

export default function UniversityUpdates() {
  const [items, setItems] = useState([]);
  const token = useSelector((s) => s.auth?.token) || localStorage.getItem("token");

  const load = async () => {
    try {
      const { data } = await api.get("/api/updates?page=1&limit=10", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setItems(data.updates || []);
    } catch (err) {
      console.error("Failed loading updates:", err);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const upsert = (updated) => {
    setItems((cur) => {
      if (updated._deleted) return cur.filter((x) => x._id !== updated._id);

      const index = cur.findIndex((x) => x._id === updated._id);
      if (index === -1) return [updated, ...cur];

      const copy = [...cur];
      copy[index] = updated;
      return copy;
    });
  };

  return (
    <section>
      {/* Title */}
      <div className="mb-5">
        <h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight
                     bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent"
        >
          University Updates
        </h1>
        <p className="text-sm text-white/70 mt-1">
          Stay connected with campus life
        </p>
      </div>

      {/* Composer */}
      <UpdateComposer onPosted={(doc) => setItems((cur) => [doc, ...cur])} />

      {/* Feed */}
      <div className="space-y-4">
        {items.map((it) => (
          <div
            key={it._id}
            className="rounded-3xl p-5 bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/5 shadow-lg"
          >
            <UpdateCard item={it} onChanged={upsert} />
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-white/60">No updates yet.</div>
        )}
      </div>
    </section>
  );
}
