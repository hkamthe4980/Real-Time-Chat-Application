


"use client";

import React, { useEffect, useRef, useState } from "react";
import { getGroupMessages, sendGroupMessage, searchGroupMembers } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
/**
 * MobileChatArea
 * Props:
 *  - conversation: { id, name, avatar, members, ... }
 *  - onBack(): go back to list
 *  - onProfileClick(): open profile
 *  - senderId: currently logged-in user id (string)
 */
const MobileChatArea = ({ conversation, onBack, onProfileClick, senderId }) => {
  console.log("mobilechatarea component load")
  const groupId = conversation?.id;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // input / mentions
  const [text, setText] = useState("");
  const [mentions, setMentions] = useState([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionResults, setMentionResults] = useState([]);

  const inputRef = useRef(null);
  const chatScrollRef = useRef(null);
  const sseRef = useRef(null);

  // helper to normalize sender id from msg
  const getSenderIdFromMsg = (msg) => {
    if (!msg) return null;
    if (typeof msg.sender === "string") return msg.sender;
    if (msg.sender?._id) return msg.sender._id;
    if (msg.sender?.id) return msg.sender.id;
    return null;
  };

  // 1) load initial chat messages
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);

    const load = async () => {
      try {
        const data = await getGroupMessages(groupId);
        // normalize array
        setMessages((prev) => {
          if (prev.length === 0) return data;
          return prev;
        });

        // scroll to bottom after small delay
        setTimeout(() => {
          chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
        }, 100);
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [groupId]);


  // 2) SSE: subscribe to group updates (append new messages)

  // useEffect(() => {
  //   if (!groupId) return;

  //   // use absolute origin so EventSource works in Next dev/prod consistently
  //   const sseUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/sse/stream/${groupId}`;
  //   const es = new EventSource(sseUrl);
  //   sseRef.current = es;

  //   es.onmessage = (evt) => {
  //     try {
  //       const newMsg = JSON.parse(evt.data);
  //       setMessages((prev) => [...prev, newMsg]);
  //       // auto scroll to bottom when new message arrives
  //       setTimeout(() => {
  //         chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  //       }, 50);
  //     } catch (err) {
  //       console.error("Invalid SSE data:", err);
  //     }
  //   };

  //   es.onerror = (err) => {
  //     console.warn("SSE error", err);
  //     es.close();
  //   };

  //   return () => {
  //     es.close();
  //     sseRef.current = null;
  //   };
  // }, [groupId]);
  // mention search


  useEffect(() => {
    if (!groupId) return;

    const eventSource = new EventSource(
      `http://localhost:5001/api/sse/stream/${groupId}`
    );

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("messages frm event source data", newMessage)

      // Fix sender mismatch: SSE returns sender as STRING
      setMessages((prev) => [...prev, newMessage]);
    };

    eventSource.onerror = () => {
      console.log("❌ SSE disconnected");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [groupId]);




  const handleInputChange = async (e) => {
    const value = e.target.value;
    setText(value);

    const lastAt = value.lastIndexOf("@");
    if (lastAt === -1) {
      setShowMentionDropdown(false);
      return;
    }
    const q = value.slice(lastAt + 1);
    if (q.trim() === "") {
      const members = await searchGroupMembers(groupId, "");
      setMentionResults(members || []);
      setShowMentionDropdown(true);
      return;
    }
    const results = await searchGroupMembers(groupId, q);
    setMentionResults(results || []);
    setShowMentionDropdown(true);
  };

  const selectMention = (user) => {
    const lastAt = text.lastIndexOf("@");
    const before = text.substring(0, lastAt);
    const newText = `${before}@${user.name} `;
    setText(newText);
    setMentions((prev) => (prev.includes(user._id) ? prev : [...prev, user._id]));
    setShowMentionDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // send message (optimistic UI + backend)
  const handleSend = async () => {
    if (!text.trim()) return;
    // create optimistic message object
    const optimistic = {
      _id: `tmp-${Date.now()}`,
      groupId,
      sender: senderId,
      text,
      mentions,
      createdAt: new Date().toISOString(),
    };

    // append immediately for snappy UI
    setMessages((prev) => [...prev, optimistic]);
    // setText("");
    // setMentions([]);
    // inputRef.current?.focus();


    const token = localStorage.getItem("token");
    const currentUser = token ? jwtDecode(token) : null;
    console.log("current user from token localstorage", currentUser.name)
    if (!text.trim()) return;
    //  console.log("message from frontend " , messages.sender.name)
    await sendGroupMessage({
      groupId,
      sender: senderId,
      name: currentUser.name,
      text,
      mentions
    });

    setText("");
    setMentions([]);
    inputRef.current?.focus();

  };

  const renderMessage = (msg) => {
    // console.log("message coming from function", msg)
    const senderIdFromMsg = getSenderIdFromMsg(msg);
    // console.log("senderIdFromMsg",senderIdFromMsg)
    // console.log("senderId",senderId)
    const isSender = senderIdFromMsg && senderId && senderIdFromMsg.toString() === senderId.toString();
    console.log("issender", typeof isSender)

    return (
      <div key={msg._id || msg.createdAt} className={`mb-3 ${isSender ? "text-right" : "text-left"}`}>
        <div className={`inline-block px-3 py-2 rounded-2xl shadow ${isSender ? "bg-[#0056b3] text-white" : "bg-white text-gray-800 border"}`}>
          <div className="text-xs text-gray-200 mb-1">
            {/* show sender name for others */}
            {!isSender && <strong className="text-sm text-gray-700">{msg?.name || "User"}</strong>}
          </div>
          <div className="whitespace-pre-wrap">{msg.text}</div>
          <div className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-chat-area h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#0056b3] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button onClick={onBack} className="p-1 hover:bg-blue-600 rounded-full transition-colors flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <button onClick={onProfileClick} className="flex-1 min-w-0 text-left">
            <h2 className="text-base font-semibold truncate">{conversation.name}</h2>
            <div className="flex items-center space-x-1 text-xs text-blue-100">
              {conversation.isGroup && <span>{conversation.memberCount} members</span>}
            </div>
          </button>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button className="p-2 hover:bg-blue-600 rounded-full transition-colors">
            {/* phone icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? <div className="text-center text-gray-500">Loading messages...</div> : messages.map(renderMessage)}
      </div>

      {/* Mention dropdown */}
      {showMentionDropdown && mentionResults.length > 0 && (
        <ul className="absolute z-30 w-[90%] left-1/2 -translate-x-1/2 bottom-28 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {mentionResults.map((u) => (
            <li key={u._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => selectMention(u)}>
              {u.name}
            </li>
          ))}
        </ul>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <div className="flex items-end space-x-2">
            <button type="button" onClick={() => { }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /> </svg>
            </button>

            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={text}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] resize-none text-sm min-h-[40px] max-h-[100px]"
                rows={1}
              />
            </div>

            <button type="submit" className="p-2 bg-[#0056b3] text-white rounded-full hover:bg-[#004494] transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /> </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileChatArea;

