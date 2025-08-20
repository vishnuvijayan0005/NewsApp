import axios from "axios";
import Article from "../models/Article.js";

export const fetchExternalNews = async () => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country: "us", // or "in"
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 10,
      },
    });

    const articles = response.data.articles;

    const savedArticles = [];
    for (const article of articles) {
      // check duplicate by URL
      const exists = await Article.findOne({ source: article.url });
      if (!exists) {
        const newArticle = await Article.create({
          title: article.title,
          description: article.description || "",
          content: article.content || "",
          category: "general",
          imageUrl: article.urlToImage,
          author: null, // external so no local user
          source: article.url, // keep track of external source
        });
        savedArticles.push(newArticle);
      }
    }

    return savedArticles;
  } catch (err) {
    console.error("Error fetching external news:", err.message);
    throw new Error("Failed to fetch external news");
  }
};
