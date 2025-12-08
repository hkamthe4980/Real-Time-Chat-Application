'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
// import '@/styles/chat.css';

const ChatHeader = ({ conversation, onlineCount }) => {
  // console.log("onlineCount", onlineCount);
  const router = useRouter();
  if (!conversation) return null;

  return (
    <div className="bg-white border-b border-gray-300 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
      {/* Left side - User info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* //? back button */}
        <button
          className="inline-flex items-center border border-gray-300 px-2.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
          onClick={() => router.push("/conversations")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* //? Avatar */}
        <img
          src={
            conversation.avatar
            // ? `${conversation.avatar}=${encodeURIComponent(conversation.name)}`
            // : "https://ui-avatars.com/api/?name=" + conversation.name
          }
          alt={conversation.name}
          className="w-10 h-10 rounded-full object-cover border"
        />

        <button onClick={() => router.push(`/profile?groupId=${conversation.id}`)} className="text-left min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-black truncate hover:text-gray-700 transition-colors">{conversation.name}</h2>
          <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600">
            {/* Show online user count */}
            {onlineCount !== undefined && onlineCount > 0 && (
              <>
                {onlineCount !== undefined && onlineCount > 0 && (
                  <span className="text-green-600 font-medium ml-1">
                    {onlineCount} online
                  </span>
                )}
              </>
            )}
            {!conversation.isGroup && conversation.position && (
              <>
                <span>•</span>
                <span>{conversation.position}</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* //? call btn */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>

        {/* //? vc button */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* //? 3 dots */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;