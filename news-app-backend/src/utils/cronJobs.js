import cron from "node-cron";
import { fetchSerapiNewsForAllCategories } from "./externalApi.js";

export const startCronJobs = () => {
  // Every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("⏳ Auto-syncing SerpAPI news for all categories...");
    try {
      const total = await fetchSerapiNewsForAllCategories();
      console.log(`✅ Synced ${total} new articles across all categories`);
    } catch (err) {
      console.error("❌ Cron job failed:", err.message);
    }
  });
};
