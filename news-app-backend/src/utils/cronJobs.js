import cron from "node-cron";
import { fetchExternalNews } from "./externalApi.js";

export const startCronJobs = () => {
  // Runs every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("⏳ Auto-syncing external news...");
    try {
      const articles = await fetchExternalNews();
      console.log(`✅ Synced ${articles.length} new articles`);
    } catch (err) {
      console.error("❌ Cron job failed:", err.message);
    }
  });
};
