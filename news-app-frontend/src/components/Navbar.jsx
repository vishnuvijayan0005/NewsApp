import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount and after refresh
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("loginExpiry");

      if (token && expiry && new Date().getTime() < expiry) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("loginExpiry");
        setIsLoggedIn(false);
      }
    };

    checkLogin();

    // Auto logout if expired
    const interval = setInterval(() => {
      checkLogin();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loginExpiry");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        NewsApp
      </Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/reporter">Reporter</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
