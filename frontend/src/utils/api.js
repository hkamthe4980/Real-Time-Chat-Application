// src/utils/api.js

const BASE_URL = "/api"; // Next.js will rewrite → backend http://localhost:5000/api

/**
 * Generic API Request Handler
 */
export async function apiRequest(endpoint, method = "GET", body = null) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    // Parse JSON safely
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `Request failed (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    throw error;
  }
}


 
export const fetchChatHistory = async (limit = 10, includeMessages = false) => {
  return await apiRequest(
    `/chat/history?limit=${limit}&includeMessages=${includeMessages}`,
    "GET"
  );
};

/**
 * Get messages for a specific conversation
 */
export const getConversationMessages = async (conversationId) => {
  return await apiRequest(`/chat/conversation/${conversationId}`, "GET");
};
 


/**
 * Start a new conversation
 */
export const startNewConversation = async (title = "New Conversation") => {
  return await apiRequest(`/conversations/new`, "POST", { title });
};

/**
 * Delete a conversation permanently
 */
export const deleteConversation = async (conversationId) => {
  return await apiRequest(`/conversations/delete/${conversationId}`, "DELETE");
};


/**
 * Summarize conversation (User Story 3 — Context Optimization)
 */
export const summarizeConversation = async (conversationId) => {
  return await apiRequest(`/conversations/summarize/${conversationId}`, "POST");
};

/**
 * Get Token Usage Summary (Daily / Weekly / Monthly)
 */
export const fetchTokenSummary = async () => {
  return await apiRequest(`/tokens/summary`, "GET");
};

/**
 * Get Cost Estimate for user's total usage
 */
export const fetchCostEstimate = async () => {
  return await apiRequest(`/tokens/cost`, "GET");
};

