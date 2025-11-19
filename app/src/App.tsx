import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import CalendarColumn from "./models/CalendarColumn";
import CalendarTimeBlock from "./models/CalendarTimeBlock";

import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/HomePage"
import Login from "./pages/LoginPage"
import Admin from "./pages/AdminPage"
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/ProfilePage";

import { UserContext} from "./hooks/UserContext";
import { useContext } from "react";

export default function App() {
  const userContext = useContext(UserContext);
  const adminName = userContext.getCurrUser()?.fullName || "Admin";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/admin" element={<Admin adminName={adminName} />} />
        <Route path="/calendar" element={<Calendar columns={[
            new CalendarColumn("room 102",[new CalendarTimeBlock(new Date(2025, 8, 30, 13, 30), new Date(2025, 8, 30, 17, 0), "blah blah 2, more talking")])
        ]}/>}/>
        <Route path="/events" element={<EventPage/>} />
        <Route path="profile" element={<ProfilePage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
