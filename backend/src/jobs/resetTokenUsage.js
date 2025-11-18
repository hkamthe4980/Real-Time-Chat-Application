import cron from "node-cron";
import UserToken from "../models/userTokenModel.js";

// Runs daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Resetting daily token usage...");
  try {
    await UserToken.updateMany({}, { tokensUsed: 0, resetAt: new Date() });
    console.log("✅ Token usage reset successfully.");
  } catch (err) {
    console.error("❌ Failed to reset token usage:", err);
  }
});
