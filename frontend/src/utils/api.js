

const BASE_URL = "/api";   // Since Next.js rewrites to backend

export async function apiRequest(endpoint, method = "GET", body = null) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

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
    const res = await fetch(`${BASE_URL}${endpoint}`, options);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `Request failed (${res.status})`);
    }

    return data;
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}





// src/utils/api.js
export const fetchChatHistory = async (limit = 10, includeMessages = false) => {
  return await apiRequest(
    `/chat/history?limit=${limit}&includeMessages=${includeMessages}`,
    "GET"
  );
};
