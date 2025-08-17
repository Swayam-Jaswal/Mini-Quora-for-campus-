import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Signup";
import Login from "../features/auth/pages/Login";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import QnaPage from "../features/ques&ans/pages/QnAList";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/qna" element={<QnaPage />} />

    </Routes>
  );
}
