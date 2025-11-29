import express from "express";
// import { getUserTokenStatus } from "../controller/tokenController.js";
import { createConversation, deleteConversation, summarizeConversation } from "../controller/conversationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get("/user/token", verifyToken, getUserTokenStatus);
router.post("/conversations/new", verifyToken, createConversation);
router.delete("/conversations/delete/:id", verifyToken, deleteConversation);
router.post("/conversations/summarize/:id", verifyToken, summarizeConversation);

export default router;
