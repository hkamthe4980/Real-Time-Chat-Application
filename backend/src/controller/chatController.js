
import { getLLMStream } from "../services/llmService.js";
import { sendStreamChunk } from "../utils/streamHandler.js";
import { countMessageTokens, countTokens } from "../services/tokenService.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import UserToken from "../models/userTokenModel.js";
import {validatePrompt} from "../middleware/promptValidator.js"
export const streamChatResponse = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const userId = req.user.id;
    let { prompt, conversationId } = req.query;

    // 🧹 Sanitize conversationId
    if (conversationId) {
      conversationId = conversationId.trim();
      if (conversationId === "undefined" || conversationId === "") {
        conversationId = null;
      }
    }

    
    // validate
    const validation = validatePrompt(prompt);
    if (validation) {
      console.log("validation prompt" , validation.reason)
      sendStreamChunk(res, { error: validation.reason });
      return res.end();
    }

    // if (!prompt) {
    //   res.write(`data: ${JSON.stringify({ error: "Prompt required" })}\n\n`);
    //   return res.end();
    // }

    // ✅ Get or create user token record
    let userToken = await UserToken.findOne({ userId });
    if (!userToken) {
      userToken = await UserToken.create({
        userId,
        planType: "free",
        tokenBudget: 4000,
        tokensUsed: 0,
      });
    }

    // // ✅ Calculate remaining budget before generating
    // const remaining = userToken.tokenBudget - userToken.tokensUsed;
    const usagePercent = (userToken.tokensUsed / userToken.tokenBudget) * 100;

    // 🟡 Send warnings if applicable
    if (usagePercent >= 100) {
      sendStreamChunk(res, {
        error: "Token budget exhausted.",
        suggestion: "Upgrade your plan or wait for daily reset.",
      });
      return res.end();
    } else if (usagePercent >= 90) {
      sendStreamChunk(res, { warning: " 90% of your token budget used." });
    } else if (usagePercent >= 75) {
      sendStreamChunk(res, { warning: " 75% of your token budget used." });
    }

    //  System + User messages
    const start = Date.now();
    const systemPrompt = "You are a helpful AI assistant.";
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];




    //  Start LLM Stream
    const stream = getLLMStream(prompt);
    let firstToken = true;
    let outputText = "";
    let outputTokens = 0;

    for await (const chunk of stream) {
      if (firstToken) {
        const ttft = Date.now() - start;
        console.log(`✅ TTFT: ${ttft}ms`);
        firstToken = false;
      }

      if (chunk.text) {

        // outputText += countTokens(chunk.text)
        outputText += chunk.text;
        outputTokens = outputTokens + 1
        sendStreamChunk(res, { text: chunk.text });
      }
    }


    const inputTokens = countMessageTokens(messages);
    console.log(`🪙 Input Tokens: ${inputTokens}`);


    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({
        userId,
        title: prompt.slice(0, 40) + "...",
      });

    // Save user message
    await Message.create({
      conversationId: conversation._id,
      sender: "user",
      userId,
      content: prompt,
      inputTokens,
      totalTokens: inputTokens,
    });



    const totalTokens = inputTokens + outputTokens;
    const generationTime = (Date.now() - start) / 1000;

    // 💾 Save assistant response
    await Message.create({
      conversationId: conversation._id,
      userId,
      sender: "assistant",
      content: outputText,
      inputTokens,
      outputTokens,
      totalTokens,
    });

    // 📊 Update conversation token usage
    conversation.totalTokens += totalTokens;
    await conversation.save();

    // 🪙 Update user's token record
    userToken.tokensUsed += totalTokens;
    await userToken.save();

    const newRemaining = userToken.tokenBudget - userToken.tokensUsed;
    const newUsagePercent = (userToken.tokensUsed / userToken.tokenBudget) * 100;

    // 📤 Send metadata to frontend
    sendStreamChunk(res, {
      usage: {
        inputTokens,
        outputTokens,

        totalTokens,
        generationTime,
        remainingTokens: newRemaining,
        usagePercent: newUsagePercent.toFixed(1),
      },
    });

    if (newUsagePercent >= 90)
      sendStreamChunk(res, { warning: "🚨 You’ve used 90% of your token limit!" });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("❌ Chat Stream Error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};





// Fetch all conversations & messages for a user
export const getChatHistory = async (req, res) => {
  try {
    console.log("User Id from getChatHistory", req.user.id)
    const userId = req.user.id;

    // Optional query params: limit, includeMessages
    const { limit = 10, includeMessages = false } = req.query;

    // 🧾 Fetch all conversations for user, newest first
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    // If user wants full chat content, include messages
    if (includeMessages === "true") {
      const data = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await Message.find({ conversationId: conv._id })
            .sort({ createdAt: 1 })
            .select("sender content totalTokens createdAt");
          return {
            _id: conv._id,
            title: conv.title,
            totalTokens: conv.totalTokens,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            messages,
          };
        })
      );

      return res.json({
        success: true,
        count: data.length,
        conversations: data,
      });
    }

    // Return summary (titles only)
    res.json({
      success: true,
      count: conversations.length,
      conversations: conversations.map((c) => ({
        _id: c._id,
        title: c.title,
        totalTokens: c.totalTokens,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chat history" });
  }
};















