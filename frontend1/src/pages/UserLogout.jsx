import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext.jsx";

const UserLogout = () =>
{
  const { token, logout } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() =>
  {
    const performLogout = async () =>
    {
      if (!token) {
        localStorage.removeItem("token");
        navigate("/userlogin");
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          logout(); // Remove token from context
          localStorage.removeItem("token");
          navigate("/userlogin");
        }
      } catch (error) {
        // Ensure token is cleared even if request fails
        logout();
        localStorage.removeItem("token");
        navigate("/userlogin");
      }
    };

    performLogout();
  }, [token, logout, navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default UserLogout;
