import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserContext from './Context/UserContext.jsx'
import CaptainContext from './Context/CaptainContext.jsx'
import { SocketProvider } from './Context/SocketContext.jsx'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from './ErrorBoundary.jsx';

createRoot(document.getElementById("root")).render(

  <ErrorBoundary>
    <SocketProvider>
      <CaptainContext>
        <UserContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContext>
      </CaptainContext>
    </SocketProvider>
  </ErrorBoundary>

);