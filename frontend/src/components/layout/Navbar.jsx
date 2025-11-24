// src/components/layout/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full panel py-3 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6c7cff] to-[#b56bff] text-white font-bold">
          MQ
        </div>

        {/* Brand Name */}
        <div className="text-white font-bold text-lg">Mini Quora</div>

      </div>

      {/* Right Section */}
      <nav className="flex items-center gap-6 text-white/80 font-medium">
        <Link to="/" className="hover:text-white transition">
          Home
        </Link>
        <Link to="/qna" className="hover:text-white transition">
          Q&A
        </Link>
        
        <Link to="/admin" className="text-[#f6e05e] hover:opacity-90 transition">
          Admin Dashboard
        </Link>

        {/* Icons */}
        <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
          🔔
        </div>
        <Link to="/profile" className="hover:text-white transition">
          👤
        </Link>
      </nav>
    </header>
  );
}
