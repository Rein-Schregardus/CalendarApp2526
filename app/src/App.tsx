import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import CalendarColumn from "./Models/CalendarColumn";
import CalendarTimeBlock from "./Models/CalendarTimeBlock";

import NotFoundPage from "./pages/NotFoundPage";
import Home from "./pages/HomePage"
import Login from "./pages/LoginPage"
import Admin from "./pages/AdminPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/calendar" element={<Calendar columns={[
            new CalendarColumn("room 102",[new CalendarTimeBlock(new Date(2025, 8, 30, 13, 30), new Date(2025, 8, 30, 17, 0), "blah blah 2, more talking")])
        ]}/>}/>
        <Route path="/events" element={<EventPage/>} />
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
