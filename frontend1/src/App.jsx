import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import Test from "./pages/TestPage";
import NotFound from "./pages/NotFound";


const App = () =>
{
  return (
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/test" element={<Test />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/usersignup" element={<UserSignup />} />
      <Route path="/captainlogin" element={<CaptainLogin />} />
      <Route path="/captainsignup" element={<CaptainSignup />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default App;

// src/App.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import TestPage from "./pages/TestPage";
// const App = () =>
// {
//   return (
//     <Routes>
//       <Route path="/" element={<TestPage />} />
//     </Routes>
//   );
// };

// export default App;