import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../Context/UserContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/userlogin`, { email, password });
      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-center">
      <form onSubmit={submitHandler} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
          required
        />

        <button
          type="submit"
          className="bg-black text-white font-semibold mb-4 rounded-lg px-4 py-2 w-full text-lg"
        >
          Login
        </button>

        <p className="text-center text-sm mb-4">
          New here?{" "}
          <Link to="/usersignup" className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>

        <Link
          to="/captainlogin"
          className="bg-green-600 mb-2 text-white text-center font-semibold rounded-lg px-4 py-2 w-full block"
        >
          Sign in as Captain
        </Link>
      </form>
    </div>
  );
};

export default UserLogin;
