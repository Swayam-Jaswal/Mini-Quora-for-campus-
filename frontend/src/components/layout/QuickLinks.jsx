import React from "react";

export default function QuickLinks() {
  return (
    <aside className="w-1/5 bg-black/20 rounded-2xl p-4 shadow-lg hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
      <ul className="space-y-3">
        <li>
          <button className="w-full text-left hover:text-gray-300">Dashboard</button>
        </li>
        <li>
          <button className="w-full text-left hover:text-gray-300">My Questions</button>
        </li>
        <li>
          <button className="w-full text-left hover:text-gray-300">AI Assistant</button>
        </li>
      </ul>
    </aside>
  );
}
