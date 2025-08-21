import { useEffect, useState } from "react";
import React from "react";
import api from "../api/client.js";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [newReporter, setNewReporter] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch all news
  const fetchArticles = async () => {
    const { data } = await api.get("/admin/news"); // match backend route
    setArticles(data);
  };

  // Fetch all reporters
  const fetchReporters = async () => {
    const { data } = await api.get("/admin/reporters"); // add this endpoint in backend if needed
    setReporters(data);
  };

  // Add new reporter
  const handleAddReporter = async (e) => {
    e.preventDefault();
    await api.post("/admin/reporters", newReporter);
    setNewReporter({ name: "", email: "", password: "" });
    fetchReporters();
  };

  // Toggle reporter status
  const toggleReporter = async (id) => {
    await api.patch(`/admin/reporters/${id}/toggle`);
    fetchReporters();
  };

  // Delete reporter
  const deleteReporter = async (id) => {
    await api.delete(`/admin/reporters/${id}`);
    fetchReporters();
  };

  // Delete news
  const deleteNews = async (id) => {
    await api.delete(`/admin/news/${id}`);
    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
    fetchReporters();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Sync External News */}
      <button
        onClick={async () => {
          await api.post("/articles/sync");
          fetchArticles();
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Sync External News
      </button>

      {/* Add Reporter Form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add Reporter</h2>
        <form onSubmit={handleAddReporter} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newReporter.name}
            onChange={(e) =>
              setNewReporter({ ...newReporter, name: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newReporter.email}
            onChange={(e) =>
              setNewReporter({ ...newReporter, email: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newReporter.password}
            onChange={(e) =>
              setNewReporter({ ...newReporter, password: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Reporter
          </button>
        </form>
      </div>

      {/* Reporter List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Reporters</h2>
        <ul>
          {reporters.map((r) => (
            <li
              key={r._id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>
                {r.name} ({r.email}) - <strong>{r.status}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleReporter(r._id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  {r.status === "active" ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteReporter(r._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* News List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">News Articles</h2>
        <ul>
          {articles.map((a) => (
            <li
              key={a._id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>
                {a.title} -{" "}
                <span className="text-sm text-gray-600">{a.category}</span>
              </span>
              <button
                onClick={() => deleteNews(a._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
