import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';

const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Watch for token changes
    if (!localStorage.getItem("token")) {
      console.log("Token missing, redirecting to login");
      navigate("/userlogin");
    }
  }, [navigate, token]);

  return <div>{children}</div>;
};

export default UserProtectedWrapper;
