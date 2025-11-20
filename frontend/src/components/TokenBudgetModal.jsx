"use client";
import React from "react";
import { startNewConversation, deleteConversation, summarizeConversation } from "../utils/api";

export default function TokenBudgetModal({ eventData, onClose, onAction }) {
  if (!eventData) return null;

  const { message, details, options } = eventData;

  const handleAction = async (id) => {
    try {
      if (id === "start_new") {
        const res = await startNewConversation("New Chat");
        onAction({ type: "start_new", conversation: res.conversation });
      }

      if (id === "delete_conv") {
        await deleteConversation(details.conversationId);
        onAction({ type: "delete_conv" });
      }

      if (id === "summarize") {
        await summarizeConversation(details.conversationId);
        onAction({ type: "summarize" });
      }

      if (id === "upgrade") {
        window.location.href = "/pricing";
      }
    } catch (e) {
      alert("Action failed: " + e.message);
    }
  };

  // Format reset timer if present
  let resetTimer = null;
  if (details && details.resetAt) {
    const resetDate = new Date(details.resetAt);
    const now = new Date();
    const ms = resetDate - now;
    if (ms > 0) {
      const h = Math.floor(ms / 1000 / 60 / 60);
      const m = Math.floor((ms / 1000 / 60) % 60);
      resetTimer = `Daily limit resets in ${h}h ${m}m`;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">
          Token Budget Exhausted
        </h2>
        {resetTimer && (
          <div className="text-sm text-gray-600 mb-2">{resetTimer}</div>
        )}
        {/* <p className="text-gray-600 mb-4">{message}</p> */}
        {/* <div className="space-y-2">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleAction(opt.id)}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {opt.label}
            </button>
          ))}
        </div> */}
        <button
          onClick={onClose}
          className="w-full mt-3 border py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
