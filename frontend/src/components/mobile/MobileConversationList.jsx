

"use client";
import React, { useState } from "react";

const MobileConversationList = ({ conversations = [], onSelectConversation }) => {
  console.log("mobileconversationList load")
  const [searchQuery, setSearchQuery] = useState("");

  // Filter to show only group conversations
  const groupConversations = conversations.filter((conv) => conv.isGroup);

  const filteredConversations = groupConversations.filter((conv) =>
    (conv.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mobile-conversation-list h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#0056b3] text-white px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Chats</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-blue-600 rounded-full transition-colors">
              {/* search icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-blue-600 rounded-full transition-colors">
              {/* new chat icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-2 pl-10 focus:outline-none text-sm"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className="mobile-conversation-item px-4 py-3 border-b border-gray-200 active:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-medium text-gray-900 truncate">{conversation.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate flex-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 flex-shrink-0 w-5 h-5 bg-[#0056b3] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>

                {conversation.isUrgent && (
                  <div className="flex items-center space-x-1 mt-1">
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-red-600 font-medium">Urgent</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* {filteredConversations.length === 0 && (
          <div className="p-4 text-center text-gray-500">No conversations</div>
        )} */}
      </div>
    </div>
  );
};

export default MobileConversationList;
