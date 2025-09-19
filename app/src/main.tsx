import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './components/login'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login></Login>
  </StrictMode>,
)
