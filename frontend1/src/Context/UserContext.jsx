import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext();

const UserContext = ({ children }) =>
{
    const [user, setUser] = useState(null); // start with null

    useEffect(() =>
    {
        const token = localStorage.getItem("token");

        if (token) {
            axios
                .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) =>
                {
                    setUser(res.data.user); // ✅ real user data from backend
                })
                .catch((err) =>
                {
                    console.error("❌ Failed to fetch user:", err);
                    setUser(null);
                });
        }
    }, []);

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;
