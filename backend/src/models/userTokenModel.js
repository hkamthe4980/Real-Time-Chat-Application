
import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  planType: { type: String, default: "free" }, // free/pro
  tokenBudget: { type: Number, default: 4000 }, // daily budget
  tokensUsed: { type: Number, default: 0 },
  resetAt: { type: Date }, // next reset timestamp
  dailyBudgetResetInterval: { type: String, default: "daily" }, // could be daily/monthly
  spendCapUsd: { type: Number, default: 0 }, // optional
}, { timestamps: true });

export default mongoose.model("UserToken", userTokenSchema);
