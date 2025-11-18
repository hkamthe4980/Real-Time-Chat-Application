import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
   userId: { type: mongoose.Schema.Types.ObjectId , ref: "User", required: true },
  sender: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  inputTokens: Number,
  outputTokens: Number,
  totalTokens: Number,
  costUsd: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
