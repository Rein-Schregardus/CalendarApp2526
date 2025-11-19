import "./fontawesome"
import { StrictMode, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import {UserContext, UserProvider} from "./hooks/UserContext.tsx";
import {ThemeProvider} from "./hooks/ThemeProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="text-text">
    <ThemeProvider>
      <UserProvider>
        <App/>
      </UserProvider>
    </ThemeProvider>
    </div>
  </StrictMode>,
)
