import { useState } from "react";
import api from "../api/client.js";
import React from "react";

export default function ReporterDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/articles", { title, description, category });
    alert("Article added");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reporter Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="general">General</option>
          <option value="politics">Politics</option>
          <option value="sports">Sports</option>
          <option value="tech">Tech</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
        </select>
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Add Article
        </button>
      </form>
    </div>
  );
}
