import express from "express";
import {
  createGroup,
  getGroupMembers,
  searchGroupMembers,
  getGroupProfile,
} from "../controller/groupController.js";

const router = express.Router();

// Create new group
router.post("/", createGroup);

// Get all members of a group
router.get("/:id/members", getGroupMembers);

// Search group members using @input
router.get("/:id/members/search", searchGroupMembers);

//? grp profile
router.get("/:id/profile", getGroupProfile);

export default router;
