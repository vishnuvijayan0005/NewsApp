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

    // Redirect if already logged in and not expired
    if (token && role && expiry && new Date().getTime() < expiry) {
      setIsLoggedIn(true);
      if (role === "admin") navigate("/admin");
      else if (role === "reporter") navigate("/reporter");
    }
    // else stay on login page if user clicked login
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // 1 hour expiry
      const expireTime = new Date().getTime() + 60 * 60 * 1000;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("loginExpiry", expireTime);

      setIsLoggedIn(true);

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "reporter") navigate("/reporter");
      else navigate("/");
    } catch (err) {
      // Display specific error from backend if exists
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
