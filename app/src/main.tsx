import "./fontawesome"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationsProvider } from "@/context/NotificationsContext.tsx"
import App from './App.tsx'
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </StrictMode>,
)
