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

  //  For pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (reset = false) => {
    try {
      setLoading(true);
      const { data } = await api.get("/articles", {
        params: { category, page, limit: 10 }, //  Send page & limit
      });

      if (reset) {
        setArticles(data.articles);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset when category changes
  useEffect(() => {
    setPage(1);
    fetchArticles(true);
  }, [category]);

  // Scroll button
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          📰 NewsSync
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Stay informed with the latest updates from around the world
        </p>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800/80 backdrop-blur-md py-3 mb-6 shadow-sm rounded-xl transition-colors duration-500">
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

      {/* Articles */}
      {loading && page === 1 ? (
        // Skeleton for first load
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl animate-pulse shadow-lg"
            />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>

          {/* ✅ Load More button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                  fetchArticles();
                }}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg">
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
