import "./fontawesome"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationsProvider } from "@/context/NotificationsContext.tsx"
import App from './App.tsx'
import './index.css';
import {UserProvider} from "./hooks/UserProvider.tsx";
import {ThemeProvider} from "./hooks/ThemeProvider.tsx";
import {GlobalModalProvider} from "./context/GlobalModalContext.tsx"
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <div className="text-text">
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <UserProvider>
          <NotificationsProvider>
            <GlobalModalProvider>
              <App />
            </GlobalModalProvider>
          </NotificationsProvider>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
  </div>
);