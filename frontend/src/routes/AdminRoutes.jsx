import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <p className="text-center text-gray-400">Checking session...</p>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin" && user.role !== "moderator") {
    return <Navigate to="/" replace />;
  }

  return children;
}
