/*
  - Defines Express routes for messaging actions: send message (/send), fetch group messages (/group/:groupId), get user groups (/get-groups).
  - Adds a /typing route to broadcast typing events to group members via SSE (broadcastToGroup).
  - Adds an /upload route that accepts a single file (multiplied by multer), saves a message document to DB, and broadcasts a new_message SSE event with file metadata (and optional transcription).
*/

import express from "express";
import multer from "multer";
import {
  sendMessage,
  getGroupMessages,
  getUserGroupsWithLastMessage,
  editMessage,
  deleteMessage,
} from "../controller/messageController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import Message from "../models/groupMessageModel.js"; // ⭐ ADDED

// ⭐ IMPORTANT: you FORGOT this !
import { broadcastToGroup } from "./sseRoutes.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/group/:groupId", getGroupMessages);
router.get("/get-groups", verifyToken, getUserGroupsWithLastMessage);

//* Edit Msg
router.patch("/edit/:id", verifyToken, editMessage);

//* Delete Msg
router.delete("/delete/:id", verifyToken, deleteMessage);

/* -----------------------------------------------------------
    ⭐ MULTER STORAGE FOR FILE UPLOADS
----------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: "uploads/", // save files inside /uploads
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });


/*
  - Adds a /typing route to broadcast typing events to group members via SSE (broadcastToGroup).
*/
// ⭐ TYPING ROUTE FIXED
router.post("/typing", (req, res) => {
  const { groupId, senderId, typing, userName, userAvatar } = req.body;

  broadcastToGroup(groupId, "typing", {
    type: "typing",
    senderId,
    userName,
    userAvatar,
    typing,
  });

  res.json({ success: true });
});



/*
  - Adds an /upload route that accepts a single file (multiplied by multer), saves a message document to DB, and broadcasts a new_message SSE event with file metadata (and optional transcription).
*/
//* upload route
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    // ⭐ type can be: "file" (image/doc) or "audio" (voice note)
    const { groupId, senderId, name, type, avatar } = req.body;

    // ⭐ ADD THIS 
    const transcription = req.body.transcription || null;

    console.log("📂 FILE RECEIVED:", file);
    console.log("📥 BODY:", req.body);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const messageType = type || "file"; // default for old calls

    // ⭐ SAVE FILE / AUDIO MESSAGE TO DB
    const message = await Message.create({
      groupId,
      sender: senderId,
      type: messageType, // "file" | "audio"
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      createdAt: new Date(),

      // ⭐ you can later fill this with real transcription (OpenAI, etc)
      transcription,
    });

    // ⭐ BROADCAST USING SSE
    broadcastToGroup(groupId, "new_message", {
      _id: message._id,
      groupId,
      sender: senderId,
      name,
      userAvatar: avatar, // ⭐ Include avatar for frontend
      type: message.type || "file",        // 👈 IMPORTANT for frontend
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      fileType: message.fileType,
      // fileType: file.mimetype,
      // transcription: message.transcription, // null for now

      ...(message.transcription
        ? { transcription: message.transcription }
        : {}),

      createdAt: message.createdAt,
    });


    // // Background transcription for audio messages
    // if (type === "audio") {
    //   transcribeAndSave(message); // run offline
    // }

    return res.status(201).json(message);
  } catch (err) {
    console.log("❌ FILE / AUDIO UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
);

export default router;