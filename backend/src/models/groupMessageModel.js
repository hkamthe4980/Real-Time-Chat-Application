import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "WayBeyondUser", required: true },
  text: { type: String },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "WayBeyondUser" }], // stored user ids

  // ⭐ ADDED FOR FILE UPLOAD
  type: { type: String, default: "text" },  // "text" or "file"
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },

  // ⭐ ADDED FOR AUDIO TRANSCRIPTION (voice → text saved in backend)
  transcription: { type: String },

  //? edit & delete
  isDeleted: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GroupMessageChat || mongoose.model("GroupMessageChat", messageSchema);
