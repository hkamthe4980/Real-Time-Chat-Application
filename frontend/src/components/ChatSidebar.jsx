// 'use client';
import React, { useState } from 'react';

const ChatSidebar = ({ conversations, selectedConversation, onSelectConversation, showChat, setShowChat }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'Urgent', 'Groups'];

  return (
    <div className={`${showChat ? 'hidden' : 'flex'} md:flex md:chat-sidebar w-full md:w-auto flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <div className="flex space-x-1">
            {/* search btn`` */}
            {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button> */}
            {/* plus btn */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-1 mt-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                activeFilter === filter
                  ? 'bg-[#FCD34D] text-[#0056b3]'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => {
              onSelectConversation(conversation.id);
              //
              setShowChat(true);
            }}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversation === conversation.id ? 'bg-[#FCD34D] bg-opacity-20 border-l-4 border-l-[#0056b3]' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {conversation.isUrgent && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-blue-600 font-medium">Urgent</span>
                      </div>
                    )}
                    {conversation.isGroup && (
                      <span className="text-xs text-gray-500">
                        Group • {conversation.memberCount} members
                      </span>
                    )}
                    {conversation.hasVoiceMessage && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.776a1 1 0 011-.148zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-blue-600">{conversation.voiceDuration}</span>
                      </div>
                    )}
                    {!conversation.isGroup && !conversation.hasVoiceMessage && !conversation.isUrgent && (
                      <span className="text-xs text-gray-500">Individual</span>
                    )}
                  </div>
                  {conversation.lastSeen && !conversation.isOnline && (
                    <span className="text-xs text-gray-500">{conversation.lastSeen}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-[#0056b3] text-white rounded-lg hover:bg-[#004494] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm font-medium">Broadcast</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">New Group</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;