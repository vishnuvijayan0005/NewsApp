import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ setIsLoggedIn }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const navigate = useNavigate();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const expiry = localStorage.getItem("loginExpiry");

    if (token && role && expiry && new Date().getTime() < expiry) {
      setIsLoggedIn(true);
      if (role === "admin") navigate("/admin");
      else if (role === "reporter") navigate("/reporter");
      else navigate("/");
    }
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      try {
        await api.post("/auth/register-reporter", { name, email, password });
        setMessage({
          type: "success",
          text: "Registration submitted. Admin verification pending. Please try logging in after 24 hours.",
        });
        setIsRegistering(false);
        setName("");
        setEmail("");
        setPassword("");
      } catch (err) {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Registration failed.",
        });
      }
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { email, password });
      const expireTime = new Date().getTime() + 60 * 60 * 1000;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("loginExpiry", expireTime);

      setIsLoggedIn(true);

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "reporter") navigate("/reporter");
      else navigate("/");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed. Check credentials.",
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 relative rounded-2xl shadow-2xl transition-colors duration-500
          ${
            darkMode
              ? "bg-gray-800 text-gray-100 shadow-lg shadow-black/40"
              : "bg-white text-gray-900 shadow-md shadow-gray-400/20"
          }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isRegistering ? "Register as Reporter" : "Login"}
        </h2>

        <div className="text-center mb-6">
          <button
            type="button"
            className={`hover:underline font-medium transition-colors duration-300 ${
              darkMode ? "text-yellow-400" : "text-blue-600"
            }`}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "New Reporter? Register"}
          </button>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 flex items-center gap-2 p-3 rounded-lg border-l-4 text-sm font-medium shadow-md
                ${
                  message.type === "success"
                    ? "bg-green-100 border-green-500 text-green-800"
                    : message.type === "error"
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-yellow-100 border-yellow-500 text-yellow-800"
                }`}
            >
              {message.type === "success" && <span>✔️</span>}
              {message.type === "error" && <span>❌</span>}
              {message.type === "warning" && <span>⚠️</span>}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-500 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:ring-yellow-400"
                    : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-yellow-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-yellow-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          <button
            className={`w-full py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg ${
              darkMode
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isRegistering ? "Submit Registration" : "Login"}
          </button>
        </form>

        {isRegistering && (
          <p
            className={`mt-4 text-sm text-center transition-colors duration-500 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            After registration, admin verification is required. Please try
            logging in after 24 hours.
          </p>
        )}
      </div>
    </div>
  );
}
