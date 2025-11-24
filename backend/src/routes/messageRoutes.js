import express from "express";
import {
  sendMessage,
  getGroupMessages,
  getUserGroupsWithLastMessage
} from "../controller/messageController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
 
const router = express.Router();

// Send message
router.post("/send", sendMessage);

// Get all messages of group
router.get("/group/:groupId", getGroupMessages);


router.get("/get-groups",verifyToken,getUserGroupsWithLastMessage)

export default router;
