'use client';
import React, { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';
import ChatNavigation from '@/components/ChatNavigation';
import { PiChatsFill } from "react-icons/pi";
import { IoCall } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { getUserGroupsWithLastMessage } from '@/utils/api';
 

const Conversations = ({ selectedConversation, onSelectConversation }) => {
    const router = useRouter();
    
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'Urgent', 'Groups'];
  let groupId = null
  // const [conversations] = useState([
  //   {
  //     id: 'arjun-patil',
  //     name: 'Waybeyond Mafia',
  //     avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop',
  //     lastMessage: 'Coach, I need help with my shot accuracy...',
  //     timestamp: '2m',
  //     unreadCount: 2,
  //     isUrgent: true,
  //     isOnline: true,
  //     isGroup: true,
  //     memberCount: 21
  //   },
  //   {
  //     id: 'hockey-team-a',
  //     name: 'Hockey Team A',
  //     avatar: 'https://ui-avatars.com/api/?name=Hockry+Team&background=6B7280&color=FFFFFF&size=32',
  //     lastMessage: 'Sneha: Thanks for the training plan coach!',
  //     timestamp: '1h',
  //     unreadCount: 1,
  //     isGroup: true,
  //     memberCount: 12
  //   },
  //   {
  //     id: 'sneha-joshi',
  //     name: 'Pickle ball',
  //     avatar: 'https://ui-avatars.com/api/?name=Pickle+Ball&background=6B7280&color=FFFFFF&size=32',
  //     lastMessage: 'Voice message',
  //     timestamp: '3h',
  //     hasVoiceMessage: true,
  //     voiceDuration: '0:45'
  //   },
  //   {
  //     id: 'vikram-singh',
  //     name: 'Vikram Singh',
  //     avatar: 'https://ui-avatars.com/api/?name=Vikram+S&background=6B7280&color=FFFFFF&size=32',
  //     lastMessage: 'Perfect! See you at practice tomorrow',
  //     timestamp: '1d',
  //     lastSeen: 'Last seen 8h ago'
  //   },
  //   {
  //     id: 'priya-sharma',
  //     name: 'Priya Sharma',
  //     avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=6B7280&color=FFFFFF&size=32',
  //     lastMessage: 'Thank you for the feedback on my performance',
  //     timestamp: '2d'
  //   }
  // ]);
  
   const [conversations, setConversations] = useState([]);
   useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getUserGroupsWithLastMessage(); // API CALL
        console.log("API GROUPS:", res);
        groupId = res.groupId;
      

        // Convert backend format → your UI format
        const formatted = res.map((g) => ({
          id: g.groupId,
          name: g.name,
          avatar: "https://ui-avatars.com/api/?name=" + g.name,
          lastMessage: g.lastMessage?.text || "No messages yet",
          timestamp: g.lastMessage
            ? new Date(g.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          unreadCount: 0,
          isUrgent: false,
          isOnline: false,
          isGroup: true,
          memberCount: g.members.length,
        }));

        setConversations(formatted);
      } catch (err) {
        console.error("Error fetching groups", err);
      }
    };

    fetchGroups();
  }, []);
    const [quickReplies] = useState([
      'Great work! 👏',
      'Keep it up!',
      'See you at training'
    ]);
  

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white md:w-auto md:chat-sidebar">
      <ChatNavigation/>
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-black">Conversations</h2>
          <div className="flex space-x-1">
            {/* search btn`` */}
            {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button> */}
            {/* plus btn */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-base bg-white"
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
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeFilter === filter
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => {
              // onSelectConversation(conversation.id);
          
              // setShowChat(true);
             router.push(`/chatMsg/${conversation.id}`);

            }}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversation === conversation.id ? 'bg-gray-100 border-l-4 border-l-black' : ''
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-sm rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-black truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-sm text-gray-600 font-medium">{conversation.timestamp}</span>
                </div>

                <p className="text-base text-gray-700 truncate mt-1">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {conversation.isUrgent && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-black font-semibold">Urgent</span>
                      </div>
                    )}
                    {conversation.isGroup && (
                      <span className="text-sm text-gray-500">
                        Group • {conversation.memberCount} members
                      </span>
                    )}
                    {conversation.hasVoiceMessage && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.776a1 1 0 011-.148zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 font-medium">{conversation.voiceDuration}</span>
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

      {/* Bottom Actions - Fixed */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 w-full bg-white shadow-sm z-10">
        <div className="flex space-x-2 sm:space-x-3">
          <button className="flex-1 flex flex-col items-center justify-center py-2.5 px-2 sm:px-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm">
            <PiChatsFill className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Chats</span>
          </button>

          <button className="flex-1 flex flex-col items-center justify-center py-2.5 px-2 sm:px-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity">
            <RxUpdate className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Updates</span>
          </button>

          <button className="flex-1 flex flex-col items-center justify-center py-2.5 px-2 sm:px-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity">
            <IoCall className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Calls</span>
          </button>
          
          <button className="flex-1 flex flex-col items-center justify-center py-2.5 px-2 sm:px-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm sm:text-base font-medium mt-1">New Group</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversations;