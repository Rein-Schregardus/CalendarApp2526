import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/home";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/calender" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}
