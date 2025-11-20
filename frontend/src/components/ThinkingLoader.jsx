// src/components/ThinkingLoader.jsx
"use client";
import React from "react";

export default function ThinkingLoader() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 items-center">
        <span className="w-2 h-2 rounded-full animate-bounce inline-block bg-gray-400" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full animate-bounce inline-block bg-gray-400" style={{ animationDelay: "120ms" }} />
        <span className="w-2 h-2 rounded-full animate-bounce inline-block bg-gray-400" style={{ animationDelay: "240ms" }} />
      </div>
      <span className="text-sm text-gray-500">AI is thinking...</span>
    </div>
  );
}
