// components/UserAuth.jsx
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const UserAuth = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // only navigate if loading is done and no user found
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default UserAuth;
