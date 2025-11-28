import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  avatar: {
    type: String,
    default: "https://ui-avatars.com/api/?name=Push&background=ED709F&color=FFFFFF&size=32"
  },
  passwordHash: { type: String, required: true },
  planType: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("WayBeyondUser", userSchema, "waybeyondusers");

