// import express from "express";
// import {
//   sendMessage,
//   getGroupMessages,
//   getUserGroupsWithLastMessage
// } from "../controller/messageController.js";


// import { verifyToken } from "../middleware/authMiddleware.js";
 
// const router = express.Router();

// // Send message
// router.post("/send", verifyToken, sendMessage);

// // Get all messages of group
// router.get("/group/:groupId", getGroupMessages);


// router.get("/get-groups",verifyToken,getUserGroupsWithLastMessage)

// export default router;





import express from "express";
import {
  sendMessage,
  getGroupMessages,
  getUserGroupsWithLastMessage
} from "../controller/messageController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

// ⭐ IMPORTANT: you FORGOT this !
import { broadcastToGroup } from "./sseRoutes.js";


const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/group/:groupId", getGroupMessages);
router.get("/get-groups", verifyToken, getUserGroupsWithLastMessage);

// ⭐ TYPING ROUTE FIXED
router.post("/typing", (req, res) => {
  const { groupId, senderId, typing, userName } = req.body;

  
  broadcastToGroup(groupId, {
    type: "typing",
    senderId,
    userName,
    typing,
  });

  res.json({ success: true });
});

export default router;
