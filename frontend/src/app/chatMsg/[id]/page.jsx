
// 'use client';
// import React from 'react';
// import Image from 'next/image';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import ChatHeader from "@/components/chat/ChatHeader";
// import ChatMain from "@/components/chat/ChatMain";
// import ChatInput from "@/components/chat/ChatInput";
// import ChatNavigation from '@/components/chat/ChatNavigation';

// import '@/styles/chat.css';
// import '@/styles/mobile-chat.css';


// const ChatMsg = () => {

//     const [selectedConversation, setSelectedConversation] = useState('arjun-patil');

//     const [messages, setMessages] = useState([
//         // {
//         //     id: 1,
//         //     type: 'system',
//         //     content: 'Session scheduled for today 4:00 PM - Hockey Practice',
//         //     timestamp: '10:25 AM'
//         // },
//         // {
//         //     id: 2,
//         //     type: 'received',
//         //     content: 'Coach, I\'ve been struggling with my shot accuracy during practice. Could you help me improve?',
//         //     timestamp: '10:30 AM',
//         //     reactions: [{ emoji: '👍', count: 1 }]
//         // },
//         // {
//         //     id: 3,
//         //     type: 'sent',
//         //     content: 'Absolutely! I\'ve prepared a training drill video for you. Let\'s work on your stick positioning and follow-through.',
//         //     timestamp: '10:32 AM',
//         //     attachments: [
//         //         {
//         //             type: 'video',
//         //             title: 'Hockey Shot Tutorial',
//         //             duration: '3:24',
//         //             thumbnail: '/api/placeholder/200/120'
//         //         }
//         //     ],
//         //     description: 'Hockey Shooting Fundamentals - Focus on stick positioning and follow-through'
//         // },
//         // {
//         //     id: 4,
//         //     type: 'voice',
//         //     content: 'Voice message',
//         //     duration: '1:23',
//         //     timestamp: '10:35 AM'
//         // },
//         // {
//         //     id: 5,
//         //     type: 'sent',
//         //     content: 'Here\'s your performance analysis from yesterday\'s practice:',
//         //     timestamp: '10:40 AM',
//         //     attachments: [
//         //         {
//         //             type: 'report',
//         //             title: 'Performance Report',
//         //             date: 'Jan 15, 2024',
//         //             metrics: [
//         //                 { label: 'Shot Accuracy:', value: '78%' },
//         //                 { label: 'Defensive Rating:', value: '92.1' },
//         //                 { label: 'Overall Score:', value: '8.5/10' }
//         //             ]
//         //         }
//         //     ]
//         // },
//         // {
//         //     id: 6,
//         //     type: 'received',
//         //     content: 'Wow! Thank you so much coach! This is exactly what I needed. I\'ll practice these drills before our next session. 🏑',
//         //     timestamp: '10:42 AM',
//         //     reactions: [
//         //         { emoji: '❤️', count: 1 },
//         //         { emoji: '🔥', count: 1 }
//         //     ]
//         // },
//         // {
//         //     id: 7,
//         //     type: 'typing',
//         //     content: 'Arjun is typing...',
//         //     timestamp: 'now'
//         // }
//     ]);

//    const [conversations] = useState([
//        {
//          id: 'arjun-patil',
//          name: 'Waybeyond Mafia',
//          avatar: 'https://ui-avatars.com/api/?name=Waybeyond+mafia&background=6B7280&color=FFFFFF&size=32',
//          lastMessage: 'Coach, I need help with my shot accuracy...',
//          timestamp: '2m',
//          unreadCount: 2,
//          isUrgent: true,
//          isOnline: true,
//          isGroup: true,
//          memberCount: 21
//        },
//        {
//          id: 'hockey-team-a',
//          name: 'Hockey Team A',
//          avatar: 'https://ui-avatars.com/api/?name=Hockry+Team&background=6B7280&color=FFFFFF&size=32',
//          lastMessage: 'Sneha: Thanks for the training plan coach!',
//          timestamp: '1h',
//          unreadCount: 1,
//          isGroup: true,
//          memberCount: 12
//        },
//        {
//          id: 'sneha-joshi',
//          name: 'Pickle ball',
//          avatar: 'https://ui-avatars.com/api/?name=Pickle+Ball&background=6B7280&color=FFFFFF&size=32',
//          lastMessage: 'Voice message',
//          timestamp: '3h',
//          hasVoiceMessage: true,
//          voiceDuration: '0:45'
//        },
//        {
//          id: 'vikram-singh',
//          name: 'Vikram Singh',
//          avatar: 'https://ui-avatars.com/api/?name=Vikram+S&background=6B7280&color=FFFFFF&size=32',
//          lastMessage: 'Perfect! See you at practice tomorrow',
//          timestamp: '1d',
//          lastSeen: 'Last seen 8h ago'
//        },
//        {
//          id: 'priya-sharma',
//          name: 'Priya Sharma',
//          avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=6B7280&color=FFFFFF&size=32',
//          lastMessage: 'Thank you for the feedback on my performance',
//          timestamp: '2d'
//        }
//      ]);

//     const selectedConv = conversations.find(conv => conv.id === selectedConversation);

//     const [quickReplies] = useState([
//         'Great work! 👏',
//         'Keep it up!',
//         'See you at training'
//     ]);

//     const handleSendMessage = (message) => {
//         const newMessage = {
//             id: messages.length + 1,
//             type: 'sent',
//             content: message,
//             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         };
//         setMessages([...messages, newMessage]);
//     };

//     const handleQuickReply = (reply) => {
//         handleSendMessage(reply);
//     };

//     // const selectedConv = conversations.find(conv => conv.id === selectedConversation);

//   return (
//       <div className="flex flex-col h-screen w-full overflow-hidden bg-white">
//         {/* <ChatNavigation /> */}
//           {/* Chat Header */}
//           <div className="flex-shrink-0">
//             <ChatHeader conversation={selectedConv} />
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 overflow-hidden">
//             <ChatMain
//               className=""
//               messages={messages}
//               conversation={selectedConv}
//             />
//           </div>

//           {/* Chat Input */}
//           <div className="flex-shrink-0">
//             <ChatInput
//                 onSendMessage={handleSendMessage}
//                 quickReplies={quickReplies}
//                 onQuickReply={handleQuickReply}
//             />
//           </div>
//       </div>
//   );
// };

// export default ChatMsg;





"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatHeader from "@/components/ChatHeader";
import ChatMain from "@/components/ChatMain";
import ChatInput from "@/components/ChatInput";
import { getGroupMessages, sendGroupMessage } from "@/utils/api";
import { jwtDecode } from "jwt-decode";

const ChatMsg = () => {
  const params = useParams();
  const groupId = params.id;

  // Get logged-in UserId from token stored in localStorage
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [username, setuserName] = useState("")
  console.log("UserName from decode token", username)


  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("decoded data", decoded)
        setLoggedInUserId(decoded.id);
        setuserName(decoded.name)
      }
    }
  }, []);

  const [messages, setMessages] = useState([]);
  // console.log("messages", messages)

  // ⭐ Convert backend → UI format
  const mapMessage = (msg) => {
    let senderId = "";
    let senderName = "";

    // ⭐ Case 1: Normal API message → sender is OBJECT
    if (msg.sender && typeof msg.sender === "object") {
      senderId = msg.sender._id;
      senderName = msg.sender.name;
    }

    // ⭐ Case 2: SSE message → sender is STRING + name field
    if (typeof msg.sender === "string") {
      senderId = msg.sender;
      senderName = msg.name || "Unknown";
    }

    return {
      id: msg._id,
      sender: {
        _id: senderId,
        name: senderName,
      },
      text: msg.text,
      content: msg.text,
      name: senderName,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: msg.createdAt,
      mentions: msg.mentions || [],
    };
  };


  // ⭐ Load initial messages
  useEffect(() => {
    if (!groupId || !loggedInUserId) return;

    const loadMessages = async () => {
      try {
        const data = await getGroupMessages(groupId);
        console.log("normal messages", data);
        setMessages(data.map(mapMessage));

      } catch (err) {
        console.log("Error loading messages", err);
      }
    };

    loadMessages();
  }, [groupId, loggedInUserId]);



  useEffect(() => {
    if (!groupId || !loggedInUserId) return;

    const es = new EventSource(
      `http://localhost:5000/api/sse/stream/${groupId}`
    );

    es.onmessage = (event) => {
      // console.log("data in even ", event.data)
      const backendMsg = JSON.parse(event.data);
      if (backendMsg.sender === loggedInUserId) {
        return;
      }
      console.log("SSE message", backendMsg);

      setMessages((prev) => [...prev, mapMessage(backendMsg)]);
    };

    es.onerror = () => {
      console.log("❌ SSE disconnected");
      es.close();
    };

    return () => es.close();
  }, [groupId, loggedInUserId]);


  // ⭐ Handle send message (UI only, no backend send included)
  const handleSendMessage = async (text, options = {}) => {
    const { mentions = [], isUrgent = false } = options;

    // optimistic message...
    const optimisticMsg = {
      id: "local-" + Date.now(),
      sender: loggedInUserId,
      senderName: username,
      content: text,
      mentions,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    const payload = {
      groupId,
      sender: loggedInUserId,
      text,
      mentions,
      isUrgent,
      name: username
    };

    await sendGroupMessage(payload);
  };


  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
      <ChatHeader conversation={{ name: "Chat", id: groupId }} />

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
        <ChatMain
          messages={messages}
          userId={loggedInUserId}
        />
      </div>

      <ChatInput onSendMessage={handleSendMessage} groupId={groupId} />
    </div>
  );
};

export default ChatMsg;
