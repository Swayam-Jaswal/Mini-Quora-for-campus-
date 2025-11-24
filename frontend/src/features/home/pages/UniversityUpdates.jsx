// src/features/home/pages/UniversityUpdates.jsx
import { useEffect, useState } from "react";
import api from "../../../app/api";
import UpdateComposer from "./UpdateComposer";
import UpdateCard from "./updateCard";
import { useSelector } from "react-redux";

export default function UniversityUpdates() {
  const [items, setItems] = useState([]);
  const token =
    useSelector((s) => s.auth?.token) || localStorage.getItem("token");

  // Load updates
  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/updates?page=1&limit=10", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(({ data }) => {
        if (!cancelled) setItems(data.updates || []);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [token]);

  const upsert = (updated) => {
    setItems((cur) => {
      if (updated._deleted)
        return cur.filter((x) => String(x._id) !== String(updated._id));

      const i = cur.findIndex((x) => String(x._id) === String(updated._id));
      if (i === -1) return [updated, ...cur];

      const copy = [...cur];
      copy[i] = updated;
      return copy;
    });
  };

  return (
    <section className="w-full">
      {/* Heading */}
      <div className="mb-6">
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
      <UpdateComposer onPosted={(doc) => setItems((c) => [doc, ...c])} />

      {/* Updates Feed */}
      <div className="space-y-5 mt-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-3xl p-5 bg-gradient-to-b from-slate-900/60 
                       to-slate-900/30 border border-white/5 shadow-lg"
          >
            <UpdateCard item={item} onChanged={upsert} />
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-white/50 text-center mt-10">No updates yet.</div>
        )}
      </div>
    </section>
  );
}
