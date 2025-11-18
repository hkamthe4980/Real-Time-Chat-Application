import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  planType: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("WayBeyondUser", userSchema);
