

// const BASE_URL = "/api"; // Next.js will rewrite → backend http://localhost:5000/api


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
    const response = await fetch(`http://localhost:5001/api${endpoint}`, options);

    // Parse JSON safely
    const data = await response.json().catch(() => null);
    // console.log("data from api.js: ", data);

    if (!response.ok) {
      throw new Error(data?.message || `Request failed (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error(" API Error:", error.message);
    throw error;
  }
}


 
export const fetchChatHistory = async (limit = 10, includeMessages = false) => {
  return await apiRequest(
    `/chat/history?limit=${limit}&includeMessages=${includeMessages}`,
    "GET"
  );
};

export const getConversationMessages = async (conversationId) => {
  return await apiRequest(`/chat/conversation/${conversationId}`, "GET");
};
 


export const startNewConversation = async (title = "New Conversation") => {
  return await apiRequest(`/conversations/new`, "POST", { title });
};


export const deleteConversation = async (conversationId) => {
  return await apiRequest(`/conversations/delete/${conversationId}`, "DELETE");
};


export const summarizeConversation = async (conversationId) => {
  return await apiRequest(`/conversations/summarize/${conversationId}`, "POST");
};


export const fetchTokenSummary = async () => {
  return await apiRequest(`/tokens/summary`, "GET");
};


export const fetchCostEstimate = async () => {
  return await apiRequest(`/tokens/cost`, "GET");
};




export const searchGroupMembers = async (groupId, query) => {
  return await apiRequest(
    `/groups/${groupId}/members/search?q=${encodeURIComponent(query)}`,
    "GET"
  );
};



export const sendGroupMessage = async (payload) => {
  return await apiRequest(`/messages/send`, "POST", payload);
};

export const getGroupMessages = async (groupId) => {
  return await apiRequest(`/messages/group/${groupId}`, "GET");
};

//? fetch grp details for `chatMsg/:id` page
export const getGroupDetails = async (groupId) => {
  return await apiRequest(`/groups/${groupId}/profile`, "GET");
};

export const getUserGroupsWithLastMessage = async () => {
  return await apiRequest(`/messages/get-groups`, "GET");
};
