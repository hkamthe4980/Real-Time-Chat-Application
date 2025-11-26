// 'use client';
// import React, { useState , useEffect } from 'react';
// import MobileConversationList from '@/components/mobile/MobileConversationList';
// import MobileChatArea from '@/components/mobile/MobileChatArea';
// import MobileProfile from '@/components/mobile/MobileProfile';
// import {getUserGroupsWithLastMessage ,getGroupMessages ,sendGroupMessage} from "../../utils/api"
// import '@/styles/mobile-chat.css';

// const MobileChatPage = () => {
//   const [view, setView] = useState('list'); // 'list', 'chat', 'profile'
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   // const [messages, setMessages] = useState([getGroupMessages
//   //   {
//   //     id: 1,
//   //     type: 'system',
//   //     content: 'Session scheduled for today 4:00 PM - Hockey Practice',
//   //     timestamp: '10:25 AM'
//   //   },
//   //   {
//   //     id: 2,
//   //     type: 'received',
//   //     content: 'Coach, I\'ve been struggling with my shot accuracy during practice. Could you help me improve?',
//   //     timestamp: '10:30 AM',
//   //     reactions: [{ emoji: '👍', count: 1 }]
//   //   },
//   //   {
//   //     id: 3,
//   //     type: 'sent',
//   //     content: 'Absolutely! I\'ve prepared a training drill video for you. Let\'s work on your stick positioning and follow-through.',
//   //     timestamp: '10:32 AM',
//   //     attachments: [
//   //       {
//   //         type: 'video',
//   //         title: 'Hockey Shot Tutorial',
//   //         duration: '3:24',
//   //         thumbnail: '/api/placeholder/200/120'
//   //       }
//   //     ],
//   //     description: 'Hockey Shooting Fundamentals - Focus on stick positioning and follow-through'
//   //   },
//   //   {
//   //     id: 4,
//   //     type: 'voice',
//   //     content: 'Voice message',
//   //     duration: '1:23',
//   //     timestamp: '10:35 AM'
//   //   },
//   //   {
//   //     id: 5,
//   //     type: 'sent',
//   //     content: 'Here\'s your performance analysis from yesterday\'s practice:',
//   //     timestamp: '10:40 AM',
//   //     attachments: [
//   //       {
//   //         type: 'report',
//   //         title: 'Performance Report',
//   //         date: 'Jan 15, 2024',
//   //         metrics: [
//   //           { label: 'Shot Accuracy:', value: '78%' },
//   //           { label: 'Defensive Rating:', value: '92.1' },
//   //           { label: 'Overall Score:', value: '8.5/10' }
//   //         ]
//   //       }
//   //     ]
//   //   },
//   //   {
//   //     id: 6,
//   //     type: 'received',
//   //     content: 'Wow! Thank you so much coach! This is exactly what I needed. I\'ll practice these drills before our next session. 🏑',
//   //     timestamp: '10:42 AM',
//   //     reactions: [
//   //       { emoji: '❤️', count: 1 },
//   //       { emoji: '🔥', count: 1 }
//   //     ]
//   //   },
//   //   {
//   //     id: 7,
//   //     type: 'typing',
//   //     content: 'Arjun is typing...',
//   //     timestamp: 'now'
//   //   }
//   // ]);
//   const [messages, setMessages] = useState([]);
//   const [conversations, setConversations] = useState([]);

//   useEffect(() => {
//     async function loadGroups() {
//       try {
//         const data = await getGroupMessages("691f5eed468a7d8e3ee06a43");
//         console.log("main data in getuserandgroup" , data)
//         setConversations(
//           data.map(group => ({
//             id: group.groupId,
//             name: group.name,
//             avatar: `https://ui-avatars.com/api/?name=${group.name}&background=10B981&color=FFFFFF`,
//             lastMessage: group.lastMessage?.text || "No messages yet",
//             timestamp: group.lastMessage
//               ? new Date(group.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//               : "",
//             isGroup: true,
//             memberCount: group.members.length,
//             members: group.members
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to load groups", err);
//       }
//     }

//     loadGroups();
//   }, []);

//   useEffect(() => {
//   async function loadMessages() {
//     if (!selectedConversation) return;

//     try {
//       const data = await getGroupMessages("691f5eed468a7d8e3ee06a43");
//       console.log("Fetched Messages: ", data);

//       setMessages(
//         data.map(msg => ({
//           id: msg._id,
//           type: msg.senderId === selectedConversation.currentUserId ? "sent" : "received",
//           content: msg.text,
//           timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit"
//           })
//         }))
//       );
//     } catch (err) {
//       console.error("Failed to fetch messages", err);
//     }
//   }

//   loadMessages();
// }, [selectedConversation]);





//   const handleSelectConversation = (conversationId) => {
//     const conversation = conversations.find(conv => conv.id === conversationId);
//     setSelectedConversation(conversation);
//     setView('chat');
//   };

// const handleSendMessage = async (message) => {
//   try {
//     const saved = await sendGroupMessage(selectedConversation.id, message);

//     const newMessage = {
//       id: saved._id,
//       type: "sent",
//       content: saved.text,
//       timestamp: new Date(saved.createdAt).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages(prev => [...prev, newMessage]);

//   } catch (err) {
//     console.error("Failed to send message", err);
//   }
// };


//   const handleBackFromChat = () => {
//     setView('list');
//     setSelectedConversation(null);
//   };

//   const handleBackFromProfile = () => {
//     setView('chat');
//   };

//   const handleProfileClick = () => {
//     setView('profile');
//   };

//   return (
//     <div className="mobile-chat-container h-screen w-full overflow-hidden bg-white">
//       {view === 'list' && (
//         <MobileConversationList
//           conversations={conversations}
//           onSelectConversation={handleSelectConversation}
//         />
//       )}

//       {view === 'chat' && selectedConversation && (
//         <MobileChatArea
//           conversation={selectedConversation}
//           messages={messages}
//           onSendMessage={handleSendMessage}
//           onBack={handleBackFromChat}
//           onProfileClick={handleProfileClick}
//         />
//       )}

//       {view === 'profile' && selectedConversation && (
//         <MobileProfile
//           conversation={selectedConversation}
//           onBack={handleBackFromProfile}
//         />
//       )}
//     </div>
//   );
// };

// export default MobileChatPage;










// // "use client";

// // import React, { useState, useEffect, useRef } from "react";
// // import MobileConversationList from '@/components/mobile/MobileConversationList';
// // import MobileChatArea from '@/components/mobile/MobileChatArea';
// // import MobileProfile from '@/components/mobile/MobileProfile';

// // import {
// //   getUserGroupsWithLastMessage,
// //   getGroupMessages,
// //   sendGroupMessage,
// //   searchGroupMembers,
// // } from "../../utils/api";

// // import { jwtDecode } from "jwt-decode";
// // import "@/styles/mobile-chat.css";

// // const MobileChatPage = () => {
// //   const [view, setView] = useState("list"); // list | chat | profile
// //   const [selectedConversation, setSelectedConversation] = useState(null);

// //   // -----------------------------------------
// //   // REAL MESSAGES (Replaces your dummy messages)
// //   // -----------------------------------------
// //   const [messages, setMessages] = useState([]);
// //   const [loadingMessages, setLoadingMessages] = useState(false);

// //   // Mentions system
// //   const [text, setText] = useState("");
// //   const [mentions, setMentions] = useState([]);
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [results, setResults] = useState([]);

// //   const inputRef = useRef();

// //   const [conversations, setConversations] = useState([]);
// //   console.log("main conversations", conversations)

// //   // ---------------------------------------------------------------------
// //   // LOAD GROUP LIST
// //   // ---------------------------------------------------------------------



// //   console.log("VIEW =", view);
// //   console.log("CONVERSATIONS =", conversations);

// //   useEffect(() => {
// //     async function loadGroups() {
// //       try {
// //         const data = await getUserGroupsWithLastMessage();
// //         console.log("GROUP LIST RESPONSE =", data);

// //         setConversations(
// //           data.map((group) => ({
// //             id: group.groupId,
// //             name: group.name,
// //             avatar: `https://ui-avatars.com/api/?name=${group.name}&background=10B981&color=FFFFFF`,
// //             lastMessage: group.lastMessage?.text || "No messages yet",
// //             timestamp: group.lastMessage
// //               ? new Date(group.lastMessage.createdAt).toLocaleTimeString([], {
// //                 hour: "2-digit",
// //                 minute: "2-digit",
// //               })
// //               : "",
// //             isGroup: true,
// //             memberCount: group.members.length,
// //             members: group.members,
// //           }))
// //         );
// //       } catch (err) {
// //         console.error("Failed to load groups", err);
// //       }
// //     }

// //     loadGroups();
// //   }, []);

// //   // ---------------------------------------------------------------------
// //   // SELECT CONVERSATION → load messages + open chat
// //   // ---------------------------------------------------------------------
// //   const handleSelectConversation = async (groupId) => {
// //     const conversation = conversations.find((c) => c.id === groupId);
// //     setSelectedConversation(conversation);
// //     setView("chat");

// //     // LOAD INITIAL MESSAGES
// //     setLoadingMessages(true);
// //     try {
// //       const data = await getGroupMessages(groupId);
// //       console.log("data comes from getgroupmessgaes api", data);
// //       const formatted = data.map(msg => ({
// //         id: msg._id,
// //         type: msg.sender === user._id ? "sent" : "received",
// //         content: msg.text,
// //         timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
// //           hour: "2-digit",
// //           minute: "2-digit"
// //         })
// //       }));
// //       setMessages(formatted);
// //     } finally {
// //       setLoadingMessages(false);
// //     }

// //     // ----------------------------------
// //     // Real-time SSE connect
// //     // ----------------------------------
// //     const eventSource = new EventSource(
// //       `http://localhost:5000/api/sse/stream/${groupId}`
// //     );

// //     eventSource.onmessage = (e) => {
// //       const msg = JSON.parse(e.data);

// //       const formattedMsg = {
// //         id: msg._id,
// //         type: msg.sender === user._id ? "sent" : "received",
// //         content: msg.text,
// //         timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
// //           hour: "2-digit",
// //           minute: "2-digit"
// //         })
// //       };


// //       setMessages((prev) => [...prev, formattedMsg]);
// //     };

// //     eventSource.onerror = () => {
// //       console.log("SSE disconnected");
// //       eventSource.close();
// //     };

// //     // Close when leaving chat
// //     return () => eventSource.close();
// //   };

// //   // ---------------------------------------------------------------------
// //   // MENTIONS: When typing text
// //   // ---------------------------------------------------------------------
// //   const handleInputChange = async (value) => {
// //     setText(value);

// //     const lastAt = value.lastIndexOf("@");

// //     if (lastAt === -1) return setShowDropdown(false);

// //     const query = value.slice(lastAt + 1);

// //     const list = await searchGroupMembers(selectedConversation.id, query);
// //     setResults(list);
// //     setShowDropdown(true);
// //   };

// //   const handleSelectMention = (user) => {
// //     const lastAt = text.lastIndexOf("@");
// //     const before = text.substring(0, lastAt);

// //     const newValue = before + "@" + user.name + " ";
// //     setText(newValue);

// //     if (!mentions.includes(user._id)) {
// //       setMentions((prev) => [...prev, user._id]);
// //     }

// //     setShowDropdown(false);
// //     inputRef.current?.focus();
// //   };

// //   // ---------------------------------------------------------------------
// //   // SEND MESSAGE
// //   // ---------------------------------------------------------------------
// //   const handleSendMessage = async () => {
// //     if (!text.trim()) return;

// //     const token = localStorage.getItem("token");
// //     const user = token ? jwtDecode(token) : null;

// //     await sendGroupMessage({
// //       groupId: selectedConversation.id,
// //       sender: user._id,
// //       name: user.name,
// //       text,
// //       mentions,
// //     });

// //     setText("");
// //     setMentions([]);
// //   };

// //   const handleBackFromChat = () => {
// //     setView("list");
// //     setSelectedConversation(null);
// //     setMessages([]);
// //   };

// //   const handleBackFromProfile = () => {
// //     setView("chat");
// //   };

// //   const handleProfileClick = () => {
// //     setView("profile");
// //   };

// //   // ---------------------------------------------------------------------
// //   // UI (unchanged styles)
// //   // ---------------------------------------------------------------------
// //   return (
// //     <div className="mobile-chat-container h-screen w-full overflow-hidden bg-white">
// //       {view === "list" && (
// //         <MobileConversationList
// //           conversations={conversations}
// //           onSelectConversation={handleSelectConversation}
// //         />
// //       )}

// //       {view === "chat" && selectedConversation && (
// //         <MobileChatArea
// //           conversation={selectedConversation}
// //           messages={messages}
// //           text={text}
// //           mentionResults={results}
// //           showMentionDropdown={showDropdown}
// //           onMentionSelect={handleSelectMention}
// //           onTextChange={handleInputChange}
// //           inputRef={inputRef}
// //           loading={loadingMessages}
// //           onSendMessage={handleSendMessage}
// //           onBack={handleBackFromChat}
// //           onProfileClick={handleProfileClick}
// //         />
// //       )}

// //       {view === "profile" && selectedConversation && (
// //         <MobileProfile
// //           conversation={selectedConversation}
// //           onBack={handleBackFromProfile}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default MobileChatPage;


"use client";

import React, { useState, useEffect } from "react";
import MobileConversationList from "@/components/mobile/MobileConversationList";
import MobileChatArea from "@/components/mobile/MobileChatArea";
import MobileProfile from "@/components/mobile/MobileProfile";
import { getUserGroupsWithLastMessage } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import "@/styles/mobile-chat.css";

export default function MobileChatPage() {
  const [view, setView] = useState("list"); // 'list', 'chat', 'profile'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [senderId, setSenderId] = useState(null);

  // decode token to get logged-in user id
  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const decoded = jwtDecode(token);
        // adapt to your token payload (maybe decoded._id or decoded.id)
        setSenderId(decoded._id || decoded.id || decoded.userId || null);
      }
    } catch (err) {
      console.warn("Failed to decode token:", err);
    }
  }, []);

  // load groups for the logged in user
  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await getUserGroupsWithLastMessage();
        setConversations(
          (data || []).map((group) => ({
            id: group.groupId,
            name: group.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=10B981&color=FFFFFF`,
            lastMessage: group.lastMessage?.text || "No messages yet",
            lastMessageSender: group.lastMessage?.sender || "",
            timestamp: group.lastMessage
              ? new Date(group.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "",
            isGroup: true,
            memberCount: group.members?.length || 0,
            members: group.members || [],
          }))
        );
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    }
    loadGroups();
  }, []);

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    setSelectedConversation(conversation);
    setView("chat");
  };

  const handleBackFromChat = () => {
    setView("list");
    setSelectedConversation(null);
  };

  const handleProfileClick = () => setView("profile");
  const handleBackFromProfile = () => setView("chat");

  return (
    <div className="mobile-chat-container h-screen w-full overflow-hidden bg-white">
      {view === "list" && (
        <MobileConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
        />
      )}

      {view === "chat" && (
        selectedConversation ? (
          <MobileChatArea
            conversation={selectedConversation}
            onBack={handleBackFromChat}
            onProfileClick={handleProfileClick}
            senderId={senderId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6">
            <h2 className="text-lg font-medium">No Group Selected</h2>
            <p className="text-sm mt-2 text-center">Choose a chat from the list to start messaging.</p>
          </div>
        )
      )}


      {view === "profile" && (
        <MobileProfile conversation={selectedConversation} onBack={handleBackFromProfile} />
      )}
    </div>
  );
}
