// src/features/profile/routes/profileRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import ProfileOverview from "../pages/ProfileOverview";
import ProfileSettings from "../pages/ProfileSettings";
import ProfileSecurity from "../pages/ProfileSecurity";

export default function ProfileRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Profile />}>
        <Route index element={<ProfileOverview />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="security" element={<ProfileSecurity />} />
      </Route>
    </Routes>
  );
}
