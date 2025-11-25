// 'use client';
import React, { useState } from 'react';
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ onSendMessage, quickReplies, onQuickReply }) => {
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="bg-white border-t border-gray-300 px-3 sm:px-4 py-3 sm:py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] w-full">
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-1 min-w-0">
            <textarea
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none text-sm min-h-[44px] max-h-[120px] bg-white text-black placeholder-gray-500 flex items-center"
              rows="1"
            />
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            <button
              type="button"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              type="submit"
              className="w-10 h-10 sm:w-11 sm:h-11 bg-black text-white rounded-full hover:bg-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm flex-shrink-0"
            >
              <IoMdSend className="w-5 h-5 text-white bg-black" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;