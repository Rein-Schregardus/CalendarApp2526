import "./fontawesome";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotificationsProvider } from "@/context/NotificationsContext";
import App from "./App";
import "./index.css";
import { UserProvider } from "./hooks/UserProvider";
import { ThemeProvider } from "./hooks/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import {GlobalModalProvider} from "./context/GlobalModalContext.tsx"

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <div className="text-text">
        <ThemeProvider>
          <UserProvider>
            <NotificationsProvider>
              <GlobalModalProvider>
              <App />
              </GlobalModalProvider>
            </NotificationsProvider>
          </UserProvider>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  </StrictMode>
);
