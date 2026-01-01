import { Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Calendar from "./components/Calendar";
import CalendarColumn from "./models/CalendarColumn";
import CalendarTimeBlock from "./models/CalendarTimeBlock";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Admin from "./pages/AdminPage";
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import { UserContext } from "./hooks/UserContext";
import { LogsProvider } from "./components/Admin/LogsProvider";
import OfficeAttendancePage from "./pages/OfficeAttendancePage";

export default function App() {
  const { currUser } = useContext(UserContext);

  return (
    <LogsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/admin" element={<Admin adminName="TestAdmin" />} />
        <Route path="/attendance" element={<OfficeAttendancePage/>}/>
        <Route path="/events" element={<EventPage/>} />
        <Route path="profile" element={<ProfilePage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin
                adminId={currUser?.id ?? 0}
                adminName={currUser?.fullName || "Admin"}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar
                columns={[
                  new CalendarColumn("room 102", [
                    new CalendarTimeBlock(
                      new Date(2025, 8, 30, 13, 30),
                      new Date(2025, 8, 30, 17, 0),
                      "blah blah 2, more talking"
                    ),
                  ]),
                ]}
              />
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </LogsProvider>
  );
}
