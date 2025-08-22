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
        num: 50, // ✅ Request max 50 if supported
      },
      timeout: 15000,
    });

    const results = data?.news_results || [];
    const saved = [];

    for (const item of results.slice(0, 50)) {
      // ✅ Ensure only top 50 processed
      const link = item?.link;
      if (!link) continue;

      // Skip if already exists
      const exists = await Article.findOne({ url: link, source: "serpapi" });
      if (exists) continue;

      const doc = await Article.create({
        title: item.title || "Untitled",
        description: item.snippet || item.title || "",
        content: item.snippet || "",
        category,
        imageUrl: item.thumbnail?.url || item.thumbnail || null,
        externalAuthor: null,
        source: "serpapi",
        url: link,
      });

      saved.push(doc);
    }

    // ✅ Keep only latest 50 per category from serpapi
    const toDelete = await Article.find({ category, source: "serpapi" })
      .sort({ createdAt: -1 })
      .skip(50); // skip latest 50

    if (toDelete.length) {
      const ids = toDelete.map((d) => d._id);
      await Article.deleteMany({ _id: { $in: ids } });
      console.log(`🗑️ Deleted ${ids.length} old ${category} articles`);
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
