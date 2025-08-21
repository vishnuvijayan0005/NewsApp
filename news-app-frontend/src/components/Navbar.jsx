import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        NewsApp
      </Link>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        {/* <Link to="/admin">Admin</Link>
        <Link to="/reporter">Reporter</Link> */}
      </div>
    </nav>
  );
}
