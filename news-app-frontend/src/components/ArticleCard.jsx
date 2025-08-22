import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  // Choose which date to display (publishedAt for external, createdAt for local)
  const publishedDate =
    article.publishedAt || article.createdAt || article.date;
  const updatedDate = article.updatedAt;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden p-4 hover:shadow-2xl transform hover:-translate-y-1 transition w-64">
      {/* Image */}
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-36 object-cover rounded-lg mb-3"
        />
      )}

      {/* Category & Published Date */}
      <div className="flex justify-between items-center mb-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
          {article.category || "General"}
        </span>
        {publishedDate && (
          <span className="text-gray-400 text-xs">
            {new Date(publishedDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-md font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
        {article.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
        {article.description || article.content || "No description available."}
      </p>

      {/* Updated At */}
      {updatedDate && (
        <p className="text-gray-400 text-xs italic mb-2">
          Updated: {new Date(updatedDate).toLocaleString()}
        </p>
      )}
      {updatedDate && (
        <p className="text-gray-400 text-xs italic mb-2">
          Updated By: {article.displayAuthor}
        </p>
      )}

      {/* Read More */}
      {article.url && (
        <Link
          to={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white bg-blue-600 hover:bg-blue-700 text-xs font-medium px-3 py-1 rounded-lg transition-colors"
        >
          More Details →
        </Link>
      )}
    </div>
  );
}
