import axios from "axios";
import Article from "../models/Article.js";
import dotenv from "dotenv";
dotenv.config();

// Map categories to Google News queries
export const CATEGORY_QUERIES = {
  all: "latest news",
  politics: "politics news",
  sports: "sports news",
  tech: "technology news",
  business: "business news",
  health: "health news",
  general: "top news",
};

// Fetch & store SerpAPI (Google News engine) results into DB for a category
export const fetchSerapiNews = async (category = "general") => {
  try {
    const q = CATEGORY_QUERIES[category] || CATEGORY_QUERIES.general;

    const { data } = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_news",
        q,
        api_key: process.env.SERAPI_KEY,
        hl: "en",
        gl: "us",
      },
      timeout: 15000,
    });

    const results = data?.news_results || [];
    const saved = [];

    for (const item of results) {
      const link = item?.link;
      if (!link) continue;

      // ✅ check by url + source (serpapi), not "source" field as URL
      const exists = await Article.findOne({ url: link, source: "serpapi" });
      if (exists) continue;

      const doc = await Article.create({
        title: item.title || "Untitled",
        description: item.snippet || item.title || "",
        content: item.snippet || "",
        category,
        imageUrl: item.thumbnail?.url || item.thumbnail || null,
        author: null, // ✅ external news = no user reference
        source: "serpapi", // ✅ matches schema enum
        url: link, // ✅ store actual article link
      });

      saved.push(doc);
    }

    console.log(`✅ Saved ${saved.length} new ${category} articles`);
    return saved;
  } catch (err) {
    console.error(
      `❌ SerpAPI fetch error [${category}]:`,
      err.response?.data || err.message
    );
    return [];
  }
};

// Fetch & store for all categories at once
export const fetchSerapiNewsForAllCategories = async () => {
  const cats = Object.keys(CATEGORY_QUERIES);
  let total = 0;

  for (const cat of cats) {
    const added = await fetchSerapiNews(cat);
    total += added.length;
  }

  console.log(`🌍 Total new articles saved: ${total}`);
  return total;
};
