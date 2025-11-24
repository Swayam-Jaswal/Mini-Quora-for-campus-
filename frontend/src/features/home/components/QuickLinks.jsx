// src/components/QuickLinks.jsx
import { NavLink } from "react-router-dom";
import { Home, HelpCircle, Bot } from "lucide-react";

const base =
  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors";
const linkCls = ({ isActive }) =>
  `${base} ${
    isActive
      ? "bg-white/10 text-white shadow-inner"
      : "text-gray-300 hover:bg-white/5"
  }`;

export default function QuickLinks() {
  return (
    <aside className="bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-white/5 rounded-2xl shadow-lg p-4">
      <p className="text-xs font-semibold text-white/60 mb-3">Quick Links</p>
      <nav className="space-y-2">
        <NavLink to="/" className={linkCls}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <Home size={18} />
          </span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/qna" className={linkCls}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <HelpCircle size={18} />
          </span>
          <span>Questions</span>
        </NavLink>

        <NavLink to="/assistant" className={linkCls}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
            <Bot size={18} />
          </span>
          <span>AI Assistant</span>
        </NavLink>
      </nav>
    </aside>
  );
}
