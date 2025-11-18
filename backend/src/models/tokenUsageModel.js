import mongoose from "mongoose";

const tokenUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  inputTokens: Number,
  outputTokens: Number,
  totalTokens: Number,
  costUsd: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TokenUsage", tokenUsageSchema);
