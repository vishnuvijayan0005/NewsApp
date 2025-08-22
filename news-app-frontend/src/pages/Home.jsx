import { useEffect, useState } from "react";
import api from "../api/client.js";
import ArticleCard from "../components/ArticleCard.jsx";
import CategoryTabs from "../components/CategoryTabs.jsx";
import React from "react";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("");

  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/articles", { params: { category } });
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to NewsApp
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Stay updated with the latest news across categories
        </p>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-4 z-10 mb-6">
        <CategoryTabs
          categories={[
            "all",
            "politics",
            "sports",
            "tech",
            "business",
            "health",
            "general",
          ]}
          selected={category}
          onSelect={(cat) => setCategory(cat === "all" ? "" : cat)}
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {articles.length > 0 ? (
          articles.map((a) => <ArticleCard key={a._id} article={a} />)
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-10">
            No articles found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
