import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("loginExpiry");
      const userRole = localStorage.getItem("role");

      if (token && expiry && new Date().getTime() < expiry) {
        setIsLoggedIn(true);
        setRole(userRole);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("loginExpiry");
        setIsLoggedIn(false);
        setRole("");
      }
    };

    checkLogin();
    const interval = setInterval(checkLogin, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loginExpiry");
    setIsLoggedIn(false);
    setRole("");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="font-bold text-2xl hover:text-blue-200 transition"
        >
          NewsApp
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200 transition">
            Home
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Login
            </Link>
          ) : (
            <>
              {role === "admin" && (
                <Link to="/admin" className="hover:text-blue-200 transition">
                  Admin
                </Link>
              )}
              {(role === "admin" || role === "reporter") && (
                <Link
                  to="/reporter"
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
                >
                  {role === "admin" ? "Add News" : "Report News"}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
