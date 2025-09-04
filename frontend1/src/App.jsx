import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
  // default export alias is fine
import TestPage from "./pages/TestPage"; // ✅ correct import
// (optional) import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />   {/* ✅ use TestPage */}
      <Route path="/test" element={<TestPage />} />
      <Route path="/riding" element={<Riding />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/usersignup" element={<UserSignup />} />
      <Route path="/captainlogin" element={<CaptainLogin />} />
      <Route path="/captainsignup" element={<CaptainSignup />} />
      <Route path="/captain-riding" element={<CaptainRiding />} />
      <Route
        path="/home"
        element={
          <UserProtectedWrapper>
            <Home />
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
      <Route
        path="/captain-home"
        element={
          <UserProtectedWrapper>
            <CaptainHome />
          </UserProtectedWrapper>
        }
      />
      {/* optional */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};
export default App;
