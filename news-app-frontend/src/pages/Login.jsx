import { useState, useEffect } from "react";
import api from "../api/client.js";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Login({ setIsLoggedIn }) {
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
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          required
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
          Login
        </button>
      </form>
    </div>
  );
}
