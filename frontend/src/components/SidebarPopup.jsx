// src/components/SidebarPopup.jsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchChatHistory } from "../utils/api";  // <-- import your API

export default function SidebarPopup({ open, onClose, onSelectConversation }) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);

  // Load conversations when sidebar opens
  useEffect(() => {
    if (!open) return;

    async function loadHistory() {
      try {
        setLoading(true);
        const res = await fetchChatHistory(10, false);  // limit=10, only titles
        setConversations(res.conversations || []);
      } catch (err) {
        setError("Failed to load chat history");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      
      {/* Sidebar panel */}
      <div className="w-96 bg-white shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Conversations</h2>
          <button onClick={onClose} className="px-2 py-1">Close</button>
        </div>

        <div className="mt-4 space-y-3">

          {/* Loading Spinner */}
          {loading && (
            <p className="text-gray-500 text-center">Loading...</p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          No conversations
          {!loading && conversations.length === 0 && (
            <p className="text-gray-400 text-center">No conversations found</p>
          )}

          {/* Conversation list */}
          {!loading &&
            conversations.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  onSelectConversation?.(chat._id); // send ID to parent
                  onClose();
                }}
                className="p-3 border rounded hover:bg-indigo-50 cursor-pointer"
              >
                {chat.title}
              </div>
            ))}
        </div>
      </div>

      {/* Transparent overlay -> close on click */}
      <div className="flex-1 bg-transparent" onClick={onClose}></div>
    </div>
  );
}
