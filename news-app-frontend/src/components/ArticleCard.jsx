import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 hover:shadow-lg transition">
      {/* Article Image */}
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover rounded"
        />
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold mt-2">{article.title}</h2>

      {/* Description / Content */}
      <p className="text-gray-600 mt-1">
        {article.description || article.content}
      </p>

      {/* Category and Date */}
      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
        <span className="text-blue-500">
          Category: {article.category || "General"}
        </span>
        {article.date && (
          <span>{new Date(article.date).toLocaleDateString()}</span>
        )}
      </div>

      {/* Read More Button */}
      {article._id && (
        <Link
          to={`/news/${article._id}`}
          className="text-blue-600 mt-3 inline-block"
        >
          More Details →
        </Link>
      )}
    </div>
  );
}
