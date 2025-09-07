import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import CaptainProtectWrapper from "./pages/CaptainProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import Start from "./pages/Start";
import TestPage from "./pages/TestPage";
import { SocketProvider } from "./Context/SocketContext"; // Add this import

const App = () =>
{
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/riding" element={<Riding />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/usersignup" element={<UserSignup />} />
      <Route path="/captainlogin" element={<CaptainLogin />} />
      <Route path="/captainsignup" element={<CaptainSignup />} />
      <Route path="/captain-riding" element={<CaptainRiding />} />

      {/* User routes with socket provider for users */}
      <Route
        path="/home"
        element={
          <UserProtectedWrapper>
            <SocketProvider type="user">
              <Home />
            </SocketProvider>
          </UserProtectedWrapper>
        }
      />

      <Route
        path="/userlogout"
        element={
          <UserProtectedWrapper>
            <UserLogout />
          </UserProtectedWrapper>
        }
      />

      {/* Captain routes with socket provider for captains */}
      <Route
        path="/captain-home"
        element={
          <CaptainProtectWrapper>
            <SocketProvider type="captain">
              <CaptainHome />
            </SocketProvider>
          </CaptainProtectWrapper>
        }
      />

      {/* You might also want to add socket provider to captain-riding if it needs real-time features */}
      {/* 
      <Route 
        path="/captain-riding" 
        element={
          <CaptainProtectWrapper>
            <SocketProvider type="captain">
              <CaptainRiding />
            </SocketProvider>
          </CaptainProtectWrapper>
        } 
      />
      */}

      {/* optional */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default App;