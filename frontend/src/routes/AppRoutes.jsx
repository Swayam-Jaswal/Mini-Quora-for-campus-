import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoutes";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Signup";
import Login from "../features/auth/pages/Login";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import QnaList from "../features/ques&ans/pages/QnAList";
import QuestionDetails from "../features/ques&ans/pages/QuestionDetails";
import AdminDashboard from "../features/admin/pages/adminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/qna"
        element={
          <ProtectedRoute>
            <QnaList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qna/:id"
        element={
          <ProtectedRoute>
            <QuestionDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
