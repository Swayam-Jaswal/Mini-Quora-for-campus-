import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAtLeast } from "../../utils/roles"; // adjust path if needed

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black/30 backdrop-blur-md shadow-md">
      <h1 className="text-2xl font-bold text-white">CampusConnect</h1>

      <div className="space-x-6 text-gray-200">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/qna" className="hover:text-white transition">Q&A</Link>
        <Link to="/profile" className="hover:text-white transition">Profile</Link>

        {isAtLeast(role, "moderator") && (
          <Link
            to="/admin"
            className="hover:text-white transition font-semibold text-yellow-300"
          >
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
}
