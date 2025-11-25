// 'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ChatNavigation = ({ showProfile, setShowProfile, showChat, setShowChat}) => {
  const router = useRouter();
  return (
    <header className="bg-black text-white shadow-lg h-20">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <Image
              src="/image_logo.png"
              width={50}
              height={50}
              alt="waybeyond tech logo"
            />
          </button>
          <div className=''>
            <h1 className="text-xl font-bold text-white">Collaborator</h1>
            <p className="text-sm text-white">Waybeyond Tech</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-white text-black placeholder-black rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-white border-2 border-white"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* New Message Button */}
          <button className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition border-2 border-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Message
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 hover:opacity-80 rounded-lg transition">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-black">3</span>
          </button>

          {/* Settings */}
          <button className="p-2 hover:opacity-80 rounded-lg transition">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* User Profile */}
          <button 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 transition"
          >
            <img
              src="https://ui-avatars.com/api/?name=Coach+Ravi&background=FCD34D&color=8B2635&bold=true"
              alt="Coach"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover flex-shrink-0"
            />
            <div className="hidden md:block min-w-0">
              <p className="font-semibold text-white text-sm truncate">Ravi Shamsundar</p>
              <p className="text-white text-xs truncate">Online</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatNavigation;