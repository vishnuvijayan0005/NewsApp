import { useEffect, useState } from "react";
import React from "react";

import api from "../api/client.js";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    const { data } = await api.get("/articles");
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={async () => {
          await api.post("/articles/sync");
          fetchArticles();
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Sync External News
      </button>
      <ul>
        {articles.map((a) => (
          <li key={a._id} className="border-b py-2">
            {a.title} -{" "}
            <span className="text-sm text-gray-600">{a.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
