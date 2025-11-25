// context/user.context.js
import React, { createContext, useState, useEffect } from "react";
import axios from "../config/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new state to track restoration

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/users/profile") // backend should return user info
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          // console.log("Failed to restore user:", err.response?.data);
          localStorage.removeItem("token"); // invalid token
        })
        .finally(() => {
          setLoading(false);
        });
    } 
    else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
