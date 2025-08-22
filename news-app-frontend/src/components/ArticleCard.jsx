import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const publishedDate =
    article.publishedAt || article.createdAt || article.date;
  const updatedDate = article.updatedAt;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl rounded-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category & Date */}
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
            {article.category || "General"}
          </span>
          {publishedDate && (
            <span className="text-gray-400 text-xs">
              {new Date(publishedDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-md font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 flex-1">
          {article.description ||
            article.content ||
            "No description available."}
        </p>

        {/* Updated Info */}
        {updatedDate && (
          <p className="text-gray-400 text-xs italic mb-2">
            Updated {new Date(updatedDate).toLocaleDateString()} by{" "}
            {article.displayAuthor || "Admin"}
          </p>
        )}

        {/* Button */}
        {article.url && (
          <Link
            to={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            Read More →
          </Link>
        )}
      </div>
    </div>
  );
}
