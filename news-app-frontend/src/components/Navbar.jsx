import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="font-extrabold text-2xl tracking-wide">
            News<span className="text-yellow-300">App</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                {role === "admin" && (
                  <Link
                    to="/admin"
                    className="hover:text-yellow-300 transition"
                  >
                    Admin
                  </Link>
                )}
                {role === "reporter" && (
                  <Link
                    to="/reporter"
                    className="bg-yellow-300 text-blue-900 px-4 py-1 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    Report News
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-700 px-4 py-1 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-2 shadow-md">
          <Link
            to="/"
            className="block hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="block hover:text-yellow-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {role === "reporter" && (
                <Link
                  to="/reporter"
                  className="block bg-yellow-300 text-blue-900 px-3 py-1 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Report News
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block bg-white text-blue-700 px-3 py-1 rounded-lg font-semibold hover:bg-gray-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
