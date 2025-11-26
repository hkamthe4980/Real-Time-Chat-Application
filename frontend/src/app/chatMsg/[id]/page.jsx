
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
