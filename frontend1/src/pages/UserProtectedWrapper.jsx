import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectedWrapper = ({ children }) =>
{
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() =>
  {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token missing, redirecting to login");
      navigate("/userlogin");
    } else {
      // ✅ Optionally verify token with backend
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    // Prevent flicker before redirect
    return null;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
