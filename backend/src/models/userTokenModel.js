import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  

  tokenBudget: { type: Number, default: 8000 },
  tokensUsed: { type: Number, default: 0 },
  resetAt: { type: Date },
});

export default mongoose.model("UserToken", userTokenSchema);
