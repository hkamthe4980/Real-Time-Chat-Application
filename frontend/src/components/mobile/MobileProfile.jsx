




"use client";
import React from "react";

const MobileProfile = ({ conversation, onBack }) => {
  if (!conversation || !conversation.isGroup) return null;

  const members = conversation.members || [];

  return (
    <div className="mobile-profile h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#0056b3] text-white px-4 py-3 flex items-center">
        <button onClick={onBack} className="p-1 hover:bg-blue-600 rounded-full transition-colors mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">Group Info</h2>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Group Photo Header */}
        <div className="bg-white">
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-br from-[#0056b3] to-[#004494] flex items-center justify-center">
              <img src={conversation.avatar} alt={conversation.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
            </div>
            <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Group Name and Description */}
          <div className="px-4 py-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{conversation.name}</h3>
            {conversation.description && <p className="text-sm text-gray-600 mb-2">{conversation.description}</p>}
            <p className="text-sm text-gray-500">{conversation.memberCount} members</p>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white mt-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900">Members</h4>
              <button className="text-sm text-[#0056b3] font-medium">{conversation.memberCount}</button>
            </div>
          </div>

          <div className="px-4 py-2">
            {members.map((member, index) => (
              <div key={member._id || member.id || index} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                <img src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6B7280&color=FFFFFF`} alt={member.name} className="w-12 h-12 rounded-full object-cover mr-3" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-base font-medium text-gray-900">{member.name}</p>
                    {member.role === "admin" && <span className="text-xs bg-[#FCD34D] text-[#0056b3] px-2 py-0.5 rounded-full font-medium">Admin</span>}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add Member Button */}
            <button className="flex items-center py-3 text-[#0056b3] w-full">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-base font-medium">Add member</span>
            </button>
          </div>
        </div>

        {/* Media, Links, Docs & Settings (same layout as you provided) */}
        <div className="bg-white mt-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h4 className="text-base font-semibold text-gray-900">Media, Links, and Docs</h4>
          </div>
          <div className="px-4 py-2">
            {/* (kept simple) */}
            <button className="flex items-center justify-between py-3 w-full border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-base font-medium text-gray-900">Media</p>
                  <p className="text-xs text-gray-500">Photos, videos, and GIFs</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">24</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileProfile;
