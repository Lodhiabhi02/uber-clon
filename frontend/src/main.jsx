import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserContext from './Context/UserContext.jsx'
import CaptainContext from './Context/CaptainContext.jsx'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainContext>
      <UserContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContext>
    </CaptainContext>
  </StrictMode>
)

