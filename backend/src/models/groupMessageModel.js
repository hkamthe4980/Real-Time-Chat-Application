import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "WayBeyondUser", required: true },
  text: { type: String, required: true },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "WayBeyondUser" }], // stored user ids
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GroupMessageChat || mongoose.model("GroupMessageChat", messageSchema);
