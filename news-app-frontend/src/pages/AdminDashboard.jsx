import { useEffect, useState } from "react";
import React from "react";
import api from "../api/client.js";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sync");
  const [articles, setArticles] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [newReporter, setNewReporter] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchArticles();
    fetchReporters();
  }, []);

  const fetchArticles = async () => {
    const { data } = await api.get("/admin/news");
    setArticles(data);
  };

  const fetchReporters = async () => {
    const { data } = await api.get("/admin/reporters");
    setReporters(data);
  };

  const handleAddReporter = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/reporters", newReporter);
      setNewReporter({ name: "", email: "", password: "" });
      fetchReporters();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReporter = async (id) => {
    await api.patch(`/admin/reporters/${id}/toggle`);
    fetchReporters();
  };

  const deleteReporter = async (id) => {
    await api.delete(`/admin/reporters/${id}`);
    fetchReporters();
  };

  const deleteNews = async (id) => {
    await api.delete(`/admin/news/${id}`);
    fetchArticles();
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {[
          { id: "sync", label: "Sync News" },
          { id: "add-reporter", label: "Add Reporter" },
          { id: "manage-reporters", label: "Manage Reporters" },
          { id: "manage-news", label: "Manage News" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl p-6">
        {activeTab === "sync" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Sync External News
            </h2>
            <button
              onClick={async () => {
                await api.post("/articles/sync");
                fetchArticles();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Sync Now
            </button>
          </div>
        )}

        {activeTab === "add-reporter" && (
          <div className="max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Add Reporter
            </h2>
            <form onSubmit={handleAddReporter} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={newReporter.name}
                onChange={(e) =>
                  setNewReporter({ ...newReporter, name: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newReporter.email}
                onChange={(e) =>
                  setNewReporter({ ...newReporter, email: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newReporter.password}
                onChange={(e) =>
                  setNewReporter({ ...newReporter, password: e.target.value })
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                required
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                Add Reporter
              </button>
            </form>
          </div>
        )}

        {activeTab === "manage-reporters" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Reporters
            </h2>
            <ul className="space-y-2">
              {reporters.map((r) => (
                <li
                  key={r._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>
                    {r.name} ({r.email}) - <strong>{r.status}</strong>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleReporter(r._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      {r.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => deleteReporter(r._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "manage-news" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              News Articles
            </h2>
            <ul className="space-y-2">
              {articles.map((a) => (
                <li
                  key={a._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>
                    {a.title} -{" "}
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {a.category}
                    </span>
                  </span>
                  <button
                    onClick={() => deleteNews(a._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
