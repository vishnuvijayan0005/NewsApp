import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />; // not logged in
  if (role && userRole !== role) return <Navigate to="/" />; // role mismatch

  return children;
}
