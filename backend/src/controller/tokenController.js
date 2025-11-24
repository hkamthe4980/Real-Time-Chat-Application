// src/controllers/tokenController.js
import UserToken from "../models/userTokenModel.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";


export const getUserTokenStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    let userToken = await UserToken.findOne({ userId });
    if (!userToken) {
      userToken = await UserToken.create({ userId });
    }

    res.json({
      success: true,
      userToken: {
        tokenBudget: userToken.tokenBudget,
        tokensUsed: userToken.tokensUsed,
        remaining: Math.max(0, userToken.tokenBudget - userToken.tokensUsed),
        resetAt: userToken.resetAt,
        planType: userToken.planType,
      },
    });
  } catch (err) {
    console.error("getUserTokenStatus error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch token status" });
  }
};
