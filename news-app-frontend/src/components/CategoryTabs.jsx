import React from "react";

export default function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="flex space-x-2 my-4 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-lg ${
            selected === cat ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
