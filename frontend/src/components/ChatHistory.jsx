"use client";
import { useEffect, useState } from "react";
import { fetchChatHistory } from "../utils/api";

export default function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetchChatHistory(10, false); // fetch last 10 chats
        setHistory(res.conversations || []);
      } catch (err) {
        console.error("❌ Error loading chat history:", err);
        setError("Failed to load chat history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        ⏳ Loading your chat history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 mx-10">
      <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
         Recent Chats
      </h2>
      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">No previous conversations.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((chat) => (
            <li
              key={chat._id}
              // onClick={() => onSelectConversation?.(chat._id)}
              className="cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-indigo-50 transition"
            >
              <p className="font-medium text-gray-700">
                {chat.title || "Untitled conversation"}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(chat.updatedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
