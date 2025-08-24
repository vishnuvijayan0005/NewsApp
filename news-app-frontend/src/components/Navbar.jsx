import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react"; //  added Sun & Moon

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  //  Persist theme & apply
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="font-extrabold text-2xl tracking-wide">
            News<span className="text-yellow-300">Sync</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
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

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
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
        <div className="md:hidden bg-blue-700 dark:bg-gray-800 px-4 py-3 space-y-2 shadow-md">
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
