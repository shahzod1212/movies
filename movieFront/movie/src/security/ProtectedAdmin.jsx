import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (user?.role === "USER") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdmin;
