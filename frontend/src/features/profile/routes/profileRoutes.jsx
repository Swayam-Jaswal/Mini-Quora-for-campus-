// src/features/profile/routes/profileRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import ProfileOverview from "../pages/ProfileOverview";
import ProfileSettings from "../pages/ProfileSettings";
import ProfileSecurity from "../pages/ProfileSecurity";

export default function ProfileRoutes() {
  return (
    <Routes>
      {/* Self profile => /profile */}
      <Route path="/" element={<Profile />}>
        <Route index element={<ProfileOverview />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="security" element={<ProfileSecurity />} />
      </Route>

      {/* Other users => /profile/:userId */}
      <Route path=":userId" element={<Profile />}>
        <Route index element={<ProfileOverview />} />
        {/* ✅ only owner should see settings & security, so we keep them under self route only */}
      </Route>
    </Routes>
  );
}
