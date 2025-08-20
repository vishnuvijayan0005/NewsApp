import { useEffect, useState } from "react";
import api from "../api/client.js";
import ArticleCard from "../components/ArticleCard.jsx";
import CategoryTabs from "../components/CategoryTabs.jsx";
import React from "react";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("");

  const fetchArticles = async () => {
    const { data } = await api.get("/articles", { params: { category } });
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  return (
    <div className="p-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </div>
  );
}
