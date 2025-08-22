import { useState } from "react";
import api from "../api/client.js";
import React from "react";

export default function ReporterDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Convert file → base64 string
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // base64 string
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const articleData = {
        title,
        description,
        category,
        image, // ✅ sending base64 instead of file
      };

      await api.post("/articles", articleData);

      alert("Article added successfully!");
      setTitle("");
      setDescription("");
      setCategory("general");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add article.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Reporter Dashboard
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-lg mx-auto space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
          Add New Article
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
        >
          <option value="general">General</option>
          <option value="politics">Politics</option>
          <option value="sports">Sports</option>
          <option value="tech">Tech</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
          Add Article
        </button>
      </form>
    </div>
  );
}
