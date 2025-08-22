import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function Login({ setIsLoggedIn }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const expiry = localStorage.getItem("loginExpiry");

    if (token && role && expiry && new Date().getTime() < expiry) {
      setIsLoggedIn(true);
      if (role === "admin") navigate("/admin");
      else if (role === "reporter") navigate("/reporter");
    }
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      try {
        await api.post("/auth/register-reporter", { name, email, password });
        alert("Registration submitted. Admin verification pending.");
        setIsRegistering(false);
        setName("");
        setEmail("");
        setPassword("");
      } catch (err) {
        alert(err.response?.data?.message || "Registration failed.");
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
      alert(err.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-gray-900 shadow-2xl rounded-2xl w-full max-w-md p-8 relative">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          {isRegistering ? "Register as Reporter" : "Login"}
        </h2>

        {/* Toggle button */}
        <div className="text-center mb-6">
          <button
            type="button"
            className="text-yellow-400 hover:underline font-medium transition"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "New Reporter? Register"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          {isRegistering && (
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-gray-800 text-white"
                required
              />
            </div>
          )}

          {/* Email field */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-gray-800 text-white"
              required
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-gray-800 text-white"
              required
            />
          </div>

          {/* Submit button */}
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg">
            {isRegistering ? "Submit Registration" : "Login"}
          </button>
        </form>

        {/* Footer note */}
        {isRegistering && (
          <p className="mt-4 text-sm text-gray-400 text-center">
            After registration, admin verification is required. Therefore, try
            logging in after 24 hours.
          </p>
        )}
      </div>
    </div>
  );
}
