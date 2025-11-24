import Message from "../models/messageModel.js";
import UserToken from "../models/userTokenModel.js";
import mongoose from "mongoose";

const getDateRange = (days) => {
  const now = new Date();
  const past = new Date(now);
  past.setDate(now.getDate() - days);
  return { from: past, to: now };
};


export const getTokenUsageSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("type of userid", typeof userId)
    console.log("tokenSummary", userId)
    const { from, to } = getDateRange(30);


    const usage = await Message.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId.toString()), createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalTokens: { $sum: "$totalTokens" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log("Usage", usage)

  
    const todayRange = getDateRange(1);
    const weekRange = getDateRange(7);
    const monthRange = getDateRange(30);

    const [today, week, month] = await Promise.all([
      Message.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: todayRange.from, $lte: todayRange.to } } },
        { $group: { _id: null, total: { $sum: "$totalTokens" } } },
      ]),
      Message.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: weekRange.from, $lte: weekRange.to } } },
        { $group: { _id: null, total: { $sum: "$totalTokens" } } },
      ]),
      Message.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: monthRange.from, $lte: monthRange.to } } },
        { $group: { _id: null, total: { $sum: "$totalTokens" } } },
      ]),
    ]);
    console.log("today", today);
    console.log("week", week);


    const userToken = await UserToken.findOne({ userId });
    console.log("userToken", userToken)

    res.json({
      success: true,
      summary: {
        today: today[0]?.total || 0,

        week: week[0]?.total || 0,
        month: month[0]?.total || 0,
        totalBudget: userToken?.tokenBudget || 0,
        tokensUsed: userToken?.tokensUsed || 0,
        remaining: (userToken?.tokenBudget || 0) - (userToken?.tokensUsed || 0),
      },
      chartData: usage.map((u) => ({
        date: u._id,
        tokens: u.totalTokens,
      })),
    });
  } catch (error) {
    console.error(" Token Summary Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch token usage summary" });
  }
};


export const getTokenCost = async (req, res) => {
  try {
    const userId = req.user.id;
    const userToken = await UserToken.findOne({ userId });

    if (!userToken) return res.status(404).json({ message: "Token record not found" });

    
    const rates = { input: 0.50, output: 1 }; 
    const inputTokens = userToken.tokensUsed * 0.3;
    const outputTokens = userToken.tokensUsed * 0.7;

    const cost =
      (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;

   

    const monthlyBudget = 5; 
    const percentageUsed = (cost / monthlyBudget) * 100;

    let warning = null;
    if (percentageUsed >= 90) {
      warning = `$${cost.toFixed(2)} / $${monthlyBudget.toFixed(2)} budget used (${percentageUsed.toFixed(0)}%)`;
    }


    res.json({
      success: true,
      tokensUsed: userToken.tokensUsed,
      costUSD: cost.toFixed(6),
      rates,
      warning
    });
  } catch (error) {
    console.error("❌ Cost Calculation Error:", error);
    res.status(500).json({ success: false, error: "Failed to calculate cost" });
  }
};
