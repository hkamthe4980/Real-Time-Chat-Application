import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getTokenUsageSummary, getTokenCost } from "../controller/analyticsController.js";


const router = express.Router();

// 📊 Token summary (for charts)
router.get("/summary", verifyToken, getTokenUsageSummary);

// 💰 Cost estimation
router.get("/cost", verifyToken, getTokenCost);

export default router;
