import UserToken from "../models/userTokenModel.js";

export const checkTokenBudget = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userToken = await UserToken.findOne({ userId });
    if (!userToken)
      return res.status(404).json({ message: "User token record not found" });

    const remaining = userToken.tokenBudget - userToken.tokensUsed;
    const usagePercent = (userToken.tokensUsed / userToken.tokenBudget) * 100;

    // ⚠️ Warnings
    if (usagePercent >= 100) {
      return res.status(403).json({
        message: "Token budget exhausted",
        suggestion: "Start new conversation or upgrade your plan.",
      });
    } else if (usagePercent >= 90) {
      res.setHeader("X-Token-Warning", "90% of token budget used.");
    } else if (usagePercent >= 75) {
      res.setHeader("X-Token-Warning", "75% of token budget used.");
    }

    // Attach for controller use
    req.userToken = userToken;
    req.remainingTokens = remaining;

    next();
  } catch (error) {
    console.error("Token Budget Check Error:", error);
    res.status(500).json({ message: "Token budget check failed" });
  }
};
