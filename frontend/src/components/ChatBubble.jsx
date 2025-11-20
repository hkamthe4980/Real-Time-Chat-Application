// src/components/ChatBubble.jsx
"use client";
import React from "react";

export default function ChatBubble({ sender = "assistant", children }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] p-3 rounded-lg shadow-sm ${
          isUser ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
