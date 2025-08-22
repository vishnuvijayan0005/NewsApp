import { useEffect, useState } from "react";
import api from "../api/client.js";
import ArticleCard from "../components/ArticleCard.jsx";
import CategoryTabs from "../components/CategoryTabs.jsx";
import React from "react";
import Footer from "../components/Footer.jsx";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/articles", { params: { category } });
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  // ✅ Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Scroll to bottom
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen px-6 py-8 relative">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          📰 NewsApp
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay informed with the latest updates from around the world
        </p>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-20 bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-md py-3 mb-6">
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

      {/* Articles Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-64 shadow"
            />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No articles found in this category.
        </p>
      )}

      <Footer />

      {/* Floating Scroll Buttons */}
      {showScroll && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition transform hover:-translate-y-1"
            title="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
          <button
            onClick={scrollToBottom}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition transform hover:-translate-y-1"
            title="Scroll to bottom"
          >
            <ArrowDown size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
