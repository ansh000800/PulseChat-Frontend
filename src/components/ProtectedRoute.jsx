import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
