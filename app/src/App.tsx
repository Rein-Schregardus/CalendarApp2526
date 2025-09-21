import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
