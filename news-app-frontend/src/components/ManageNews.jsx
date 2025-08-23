import React, { useState, useEffect } from "react";
import api from "../api/client"; // ✅ make sure path is correct

function ManageNews({ articles, fetchArticles }) {
  // Delete news
  const deleteNews = async (id) => {
    try {
      await api.delete(`/admin/news/${id}`);
      fetchArticles(); // refresh list after delete
    } catch (err) {
      console.error("Delete news error:", err);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {articles.length === 0 && <p>No articles yet.</p>}
      {articles.map((art) => (
        <div
          key={art._id}
          className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition"
        >
          {/* Left side → Image + Text */}
          <div className="flex items-center flex-1">
            <div className="w-16 h-16 flex-shrink-0 mr-4">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-3">
                {art.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Category: {art.category}
              </p>
              <a
                href={art.url}
                target="_self"
                rel="noopener noreferrer"
                className="inline-block text-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors mt-1"
              >
                Read More →
              </a>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                Author: {art.displayAuthor}
              </p>
            </div>
          </div>

          {/* Right side → Delete button */}
          <button
            onClick={() => deleteNews(art._id)}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageNews;
