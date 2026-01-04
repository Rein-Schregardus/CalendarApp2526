import { Routes, Route } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Admin from "./pages/AdminPage";
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/ProfilePage";
import OfficeAttendancePage from "./pages/OfficeAttendancePage";

import { UserProvider } from "./hooks/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin adminId={0} adminName="TestAdmin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <OfficeAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserProvider>
  );
}
