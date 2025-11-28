
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  avatar: {
    type: String,
    default: "https://ui-avatars.com/api/?name=Push&background=ED709F&color=FFFFFF&size=32"
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "WayBeyondUser" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "WayBeyondUser" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model("Group", groupSchema);
