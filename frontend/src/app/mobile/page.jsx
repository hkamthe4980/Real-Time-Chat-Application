'use client';
import React, { useState , useEffect } from 'react';
import MobileConversationList from '@/components/mobile/MobileConversationList';
import MobileChatArea from '@/components/mobile/MobileChatArea';
import MobileProfile from '@/components/mobile/MobileProfile';
import {getUserGroupsWithLastMessage} from "../../utils/api"
import '@/styles/mobile-chat.css';

const MobileChatPage = () => {
  const [view, setView] = useState('list'); // 'list', 'chat', 'profile'
  const [selectedConversation, setSelectedConversation] = useState(null);
  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     type: 'system',
  //     content: 'Session scheduled for today 4:00 PM - Hockey Practice',
  //     timestamp: '10:25 AM'
  //   },
  //   {
  //     id: 2,
  //     type: 'received',
  //     content: 'Coach, I\'ve been struggling with my shot accuracy during practice. Could you help me improve?',
  //     timestamp: '10:30 AM',
  //     reactions: [{ emoji: '👍', count: 1 }]
  //   },
  //   {
  //     id: 3,
  //     type: 'sent',
  //     content: 'Absolutely! I\'ve prepared a training drill video for you. Let\'s work on your stick positioning and follow-through.',
  //     timestamp: '10:32 AM',
  //     attachments: [
  //       {
  //         type: 'video',
  //         title: 'Hockey Shot Tutorial',
  //         duration: '3:24',
  //         thumbnail: '/api/placeholder/200/120'
  //       }
  //     ],
  //     description: 'Hockey Shooting Fundamentals - Focus on stick positioning and follow-through'
  //   },
  //   {
  //     id: 4,
  //     type: 'voice',
  //     content: 'Voice message',
  //     duration: '1:23',
  //     timestamp: '10:35 AM'
  //   },
  //   {
  //     id: 5,
  //     type: 'sent',
  //     content: 'Here\'s your performance analysis from yesterday\'s practice:',
  //     timestamp: '10:40 AM',
  //     attachments: [
  //       {
  //         type: 'report',
  //         title: 'Performance Report',
  //         date: 'Jan 15, 2024',
  //         metrics: [
  //           { label: 'Shot Accuracy:', value: '78%' },
  //           { label: 'Defensive Rating:', value: '92.1' },
  //           { label: 'Overall Score:', value: '8.5/10' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: 6,
  //     type: 'received',
  //     content: 'Wow! Thank you so much coach! This is exactly what I needed. I\'ll practice these drills before our next session. 🏑',
  //     timestamp: '10:42 AM',
  //     reactions: [
  //       { emoji: '❤️', count: 1 },
  //       { emoji: '🔥', count: 1 }
  //     ]
  //   },
  //   {
  //     id: 7,
  //     type: 'typing',
  //     content: 'Arjun is typing...',
  //     timestamp: 'now'
  //   }
  // ]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await getUserGroupsWithLastMessage();
        console.log("main data in getuserandgroup" , data)
        setConversations(
          data.map(group => ({
            id: group.groupId,
            name: group.name,
            avatar: `https://ui-avatars.com/api/?name=${group.name}&background=10B981&color=FFFFFF`,
            lastMessage: group.lastMessage?.text || "No messages yet",
            timestamp: group.lastMessage
              ? new Date(group.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "",
            isGroup: true,
            memberCount: group.members.length,
            members: group.members
          }))
        );
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    }

    loadGroups();
  }, []);



  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    setSelectedConversation(conversation);
    setView('chat');
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'sent',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  const handleBackFromChat = () => {
    setView('list');
    setSelectedConversation(null);
  };

  const handleBackFromProfile = () => {
    setView('chat');
  };

  const handleProfileClick = () => {
    setView('profile');
  };

  return (
    <div className="mobile-chat-container h-screen w-full overflow-hidden bg-white">
      {view === 'list' && (
        <MobileConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
        />
      )}

      {view === 'chat' && selectedConversation && (
        <MobileChatArea
          conversation={selectedConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={handleBackFromChat}
          onProfileClick={handleProfileClick}
        />
      )}

      {view === 'profile' && selectedConversation && (
        <MobileProfile
          conversation={selectedConversation}
          onBack={handleBackFromProfile}
        />
      )}
    </div>
  );
};

export default MobileChatPage;

