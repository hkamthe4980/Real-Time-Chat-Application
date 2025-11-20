// src/controllers/conversationController.js
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import UserToken from "../models/userTokenModel.js";

/**
 * POST /api/conversations/new
 * create a new conversation and return id
 */
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const title = req.body?.title || "New Conversation";
    const conversation = await Conversation.create({ userId, title });
    return res.json({ success: true, conversation });
  } catch (err) {
    console.error("createConversation error:", err);
    return res.status(500).json({ success: false, error: "Failed to create conversation" });
  }
};

/**
 * DELETE /api/conversations/:id
 * delete a conversation and subtract tokens used in messages (free tokens)
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const conv = await Conversation.findOne({ _id: id, userId });
    if (!conv) return res.status(404).json({ success: false, error: "Conversation not found" });

    // sum tokens used by that conversation
    const agg = await Message.aggregate([
      { $match: { conversationId: conv._id } },
      { $group: { _id: null, totalTokens: { $sum: "$totalTokens" } } },
    ]);
    const freedTokens = agg[0]?.totalTokens || 0;

    // delete messages & conversation
    await Message.deleteMany({ conversationId: conv._id });
    await Conversation.deleteOne({ _id: conv._id });

    // subtract from userToken.tokensUsed (but not below 0)
    const userToken = await UserToken.findOne({ userId });
    if (userToken) {
      userToken.tokensUsed = Math.max(0, userToken.tokensUsed - freedTokens);
      await userToken.save();
    }

    return res.json({ success: true, freedTokens });
  } catch (err) {
    console.error("deleteConversation error:", err);
    return res.status(500).json({ success: false, error: "Failed to delete conversation" });
  }
};

/**
 * POST /api/conversations/:id/summarize
 * create a cheap summarization replacing old messages to reduce token footprint.
 * NOTE: For production, call a summarization LLM or long-running job.
 */
export const summarizeConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const conv = await Conversation.findOne({ _id: id, userId });
    if (!conv) return res.status(404).json({ success: false, error: "Conversation not found" });

    // Fetch existing messages (small sample)
    const messages = await Message.find({ conversationId: conv._id }).sort({ createdAt: 1 });

    // Very simple summarization: concat first/last and generate summary placeholder
    // Replace this with real LLM summarization call if available.
    const sample = messages.slice(0, 6).map(m => m.content).join("\n");
    const summaryText = `Summary: ${sample.slice(0, 500)}...`; // cheap placeholder

    // Remove old messages and insert summary message
    await Message.deleteMany({ conversationId: conv._id });
    const summaryMsg = await Message.create({
      conversationId: conv._id,
      userId,
      sender: "assistant",
      content: summaryText,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 1, // account very small token usage for summary
    });

    // recompute tokensUsed across user's messages (expensive) or subtract estimated freed amount:
    // For simplicity, recompute user's tokensUsed:
    const agg = await Message.aggregate([
      { $match: { userId: conv.userId } },
      { $group: { _id: null, total: { $sum: "$totalTokens" } } },
    ]);
    const totalUsed = agg[0]?.total || 0;
    const userToken = await UserToken.findOne({ userId });
    if (userToken) {
      userToken.tokensUsed = totalUsed;
      await userToken.save();
    }

    return res.json({ success: true, message: "Conversation summarized", summary: summaryMsg });
  } catch (err) {
    console.error("summarizeConversation error:", err);
    return res.status(500).json({ success: false, error: "Failed to summarize conversation" });
  }
};
