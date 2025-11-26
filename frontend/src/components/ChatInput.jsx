

"use client";

import React, { useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { searchGroupMembers } from "@/utils/api"; // <-- REQUIRED

const ChatInput = ({ onSendMessage, groupId }) => {
  console.log("-----------groupId i chatInput----------------" , groupId)
  const [text, setText] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  // mention state
  const [results, setResults] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef(null);

  // -------------------------------------------------------
  // ⭐ Handle Typing + Detect @ Mention
  // -------------------------------------------------------
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setText(value);

    const lastAt = value.lastIndexOf("@");

    // No @ → close dropdown
    if (lastAt === -1) {
      setShowDropdown(false);
      return;
    }

    // Extract query after '@'
    const query = value.slice(lastAt + 1).trim();

    // Empty → fetch all members
    if (!query) {
      const members = await searchGroupMembers(groupId, "");
      setResults(members);
      setShowDropdown(true);
      return;
    }

    // Search based on text after "@"
    const list = await searchGroupMembers(groupId, query);
    setResults(list);
    setShowDropdown(true);
  };

  // -------------------------------------------------------
  // ⭐ User Selects Mention → Insert into Text
  // -------------------------------------------------------
  const handleSelectMention = (user) => {
    const lastAt = text.lastIndexOf("@");

    const before = text.substring(0, lastAt); // text before @

    const updated = before + "@" + user.name + " ";

    setText(updated);

    // Store mention if not already present
    if (!mentions.includes(user._id)) {
      setMentions((prev) => [...prev, user._id]);
    }

    setShowDropdown(false);

    // Focus textarea again
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // -------------------------------------------------------
  // ⭐ Submit Message
  // -------------------------------------------------------
  const handleSubmit = (e) => {
    e && e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    const payload = {
      text: trimmed,
      isUrgent,
      mentions, // <-- SEND MENTION IDS
    };

    onSendMessage(trimmed, payload);

    setText("");
    setIsUrgent(false);
    setMentions([]);
    setShowDropdown(false);
  };

  // -------------------------------------------------------
  // ⭐ Enter Key to Send
  // -------------------------------------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // -------------------------------------------------------
  // ⭐ UI
  // -------------------------------------------------------
  return (
    <div className="relative bg-white border-t border-gray-300 px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center space-x-2">
          {/* INPUT FIELD */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... Use @ to mention"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black min-h-[44px] max-h-[120px]"
              rows="1"
            />

            {/* 🔥 Mention Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute left-0 bottom-[52px] z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {results.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectMention(user)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}

            {/* Urgent flag */}
            <label className="flex items-center text-xs mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={() => setIsUrgent((v) => !v)}
                className="mr-2"
              />
              Mark urgent
            </label>
          </div>

          {/* SEND BUTTON */}
          <button
            type="submit"
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:opacity-90"
          >
            <IoMdSend className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;

