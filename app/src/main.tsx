import "./fontawesome"
import { StrictMode, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationsProvider } from "@/context/NotificationsContext.tsx"
import App from './App.tsx'
import './index.css';
import {UserContext, UserProvider} from "./hooks/UserContext.tsx";
import {ThemeProvider} from "./hooks/ThemeProvider.tsx";
import {GlobalModalProvider} from "./context/GlobalModalContext.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="text-text">
    <ThemeProvider>
      <UserProvider>
        <NotificationsProvider>
          <GlobalModalProvider>
            <App/>
          </GlobalModalProvider>
        </NotificationsProvider>
      </UserProvider>
    </ThemeProvider>
    </div>

  </StrictMode>,
)
