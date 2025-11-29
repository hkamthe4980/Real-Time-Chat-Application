
import { getLLMStream } from "../services/llmService.js";
import { sendStreamChunk } from "../utils/streamHandler.js";
import { countMessageTokens } from "../services/tokenService.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import UserToken from "../models/userTokenModel.js";


const sendBudgetEvent = (res, payload) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const streamChatResponse = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const userId = req.user.id;
    let { prompt, conversationId } = req.query;
    console.log("------------request query-------------", req.query)
    console.log("----------main conversation Id -------------", conversationId)

    if (conversationId) {
      conversationId = conversationId.trim();
      if (conversationId === "undefined" || conversationId === "") {
        conversationId = null;
      }
    }

    // 🔍 Get user token model
    let userToken = await UserToken.findOne({ userId });
    if (!userToken) {
      userToken = await UserToken.create({
        userId,
        planType: "free",
        tokenBudget: 4000,
        tokensUsed: 0,
      });
    }

    const systemPrompt = "You are a helpful AI assistant.";
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];

    // 📌 Pre-calc input tokens BEFORE calling LLM
    const inputTokens = countMessageTokens(messages);

    const estimatedOutput = 500; // assume 500 output tokens
    const estimatedTotal = inputTokens + estimatedOutput;

    const remainingTokens = userToken.tokenBudget - userToken.tokensUsed;

    // 🚨 NEW CORRECT BUDGET CHECK (before LLM call)
    if (estimatedTotal > remainingTokens) {
      let resetAt = userToken.resetAt;
      if (!resetAt) {
        const now = new Date();
        resetAt = new Date(now);
        resetAt.setUTCHours(24, 0, 0, 0); // Next UTC midnight
      }
      sendBudgetEvent(res, {
        type: "budget_exhausted",
        message: "This message will exceed your token budget.",
        details: {
          inputTokens,
          estimatedOutput,
          estimatedTotal,
          tokenBudget: userToken.tokenBudget,
          tokensUsed: userToken.tokensUsed,
          remainingTokens,
          conversationId: conversationId || null,
          resetAt,
        },
        options: [
          { id: "start_new", label: "Start new conversation" },
          { id: "delete_conv", label: "Delete a conversation" },
          { id: "summarize", label: "Summarize & continue" },
          { id: "upgrade", label: "Upgrade plan" }
        ]
      });

      return res.end();
    }


    const start = Date.now();
    let timeoutId;
    let responseReceived = false;

    // Set timeout for 30 seconds
    const TIMEOUT_DURATION = 30000;
    timeoutId = setTimeout(() => {
      if (!responseReceived) {
        console.error("❌ Response timeout after 30s");
        sendStreamChunk(res, {
          error: "Response generation timeout",
          suggestion: "Try with a simpler question?",
          preserveMessage: true
        });
        res.end();
      }
    }, TIMEOUT_DURATION);

    const stream = getLLMStream(prompt);
    let firstToken = true;
    let outputText = "";
    let outputTokens = 0;

    for await (const chunk of stream) {
      if (chunk.error) {
        clearTimeout(timeoutId);
        responseReceived = true;

        // Handle different error types
        const errorMsg = chunk.error;
        if (errorMsg.includes("429") || errorMsg.includes("rate limit")) {
          sendStreamChunk(res, {
            error: "Service busy, please wait...",
            type: "rate_limit",
            retryAfter: 5000 // Default 5s retry
          });
        } else if (errorMsg.includes("400")) {
          sendStreamChunk(res, {
            error: "Invalid request, please try again",
            type: "bad_request"
          });
        } else if (errorMsg.includes("403")) {
          sendStreamChunk(res, {
            error: "Service authentication failed",
            type: "auth_error"
          });
        } else if (errorMsg.includes("500") || errorMsg.includes("502") || errorMsg.includes("503")) {
          sendStreamChunk(res, {
            error: "Service temporarily unavailable",
            type: "service_error",
            retryAfter: 10000
          });
        } else {
          sendStreamChunk(res, { error: errorMsg });
        }
        res.end();
        return;
      }

      if (firstToken) {
        clearTimeout(timeoutId);
        responseReceived = true;
        const ttft = Date.now() - start;
        console.log(`TTFT: ${ttft}ms`);
        firstToken = false;
      }

      if (chunk.text) {
        outputText += chunk.text;
        outputTokens += 1;
        sendStreamChunk(res, { text: chunk.text });
      }
    }

    // Save conversation
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

    // Save assistant response
    await Message.create({
      conversationId: conversation._id,
      userId,
      sender: "assistant",
      content: outputText,
      inputTokens,
      outputTokens,
      totalTokens,
    });

    conversation.totalTokens += totalTokens;
    await conversation.save();

    userToken.tokensUsed += totalTokens;
    await userToken.save();

    // Send usage info
    sendStreamChunk(res, {
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        generationTime,
        remainingTokens: userToken.tokenBudget - userToken.tokensUsed,
        usagePercent: (
          (userToken.tokensUsed / userToken.tokenBudget) * 100
        ).toFixed(1),
      },
    });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    clearTimeout(timeoutId);
    responseReceived = true;
    console.error("Chat Stream Error:", error);

    // Handle specific error types
    if (error.message.includes("timeout") || error.code === 'ETIMEDOUT') {
      sendStreamChunk(res, {
        error: "Response generation timeout",
        suggestion: "Try with a simpler question?",
        preserveMessage: true
      });
    } else if (error.status === 429) {
      sendStreamChunk(res, {
        error: "Service busy, please wait...",
        type: "rate_limit",
        retryAfter: error.headers?.['retry-after'] || 5000
      });
    } else {
      sendStreamChunk(res, { error: error.message });
    }
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
          console.log("----chat reponse-----", messages)
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

// Fetch messages for a specific conversation
export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found or access denied"
      });
    }

    // Fetch all messages for this conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .select("sender content totalTokens createdAt");

    res.json({
      success: true,
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        totalTokens: conversation.totalTokens,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      messages,
    });
  } catch (error) {
    console.error("getConversationMessages error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch conversation messages"
    });
  }
};















