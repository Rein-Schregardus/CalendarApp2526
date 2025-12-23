import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/HomePage"
import Login from "./pages/LoginPage"
import Admin from "./pages/AdminPage"
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/ProfilePage";
import OfficeAttendancePage from "./pages/OfficeAttendancePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/admin" element={<Admin adminName="TestAdmin" />} />
        <Route path="/attendance" element={<OfficeAttendancePage/>}/>
        <Route path="/events" element={<EventPage/>} />
        <Route path="profile" element={<ProfilePage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
