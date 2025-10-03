import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Calendar from "./components/Calendar";
import CalendarColumn from "./Models/CalendarColumn";
import CalendarTimeBlock from "./Models/CalendarTimeBlock";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/calendar" element={<Calendar columns={[
            new CalendarColumn("room 102",[new CalendarTimeBlock(new Date(2025, 8, 30, 13, 30), new Date(2025, 8, 30, 17, 0), "blah blah 2, more talking")])
        ]}/>}/>
      </Routes>
    </BrowserRouter>
  );
}
