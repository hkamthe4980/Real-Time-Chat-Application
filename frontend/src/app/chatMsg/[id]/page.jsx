"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatHeader from "@/components/ChatHeader";
import ChatMain from "@/components/ChatMain";
import ChatInput from "@/components/ChatInput";
import { getGroupMessages, sendGroupMessage, getGroupDetails } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const ChatMsg = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id;

  // Get logged-in UserId from token stored in localStorage
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  //? store grp details - push
  const [groupData, setGroupData] = useState(null);
  console.log("UserName from decode token", username)

  // change for recation emoji
  const getMessageId = (m) => m._id || m.id;
  const [replyMsg, setReplyMsg] = useState(null);


  //? get logged-in user details
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("decoded data", decoded);
        setLoggedInUserId(decoded.id);
        setUsername(decoded.name);
        // Use avatar from token or generate fallback
        // Populated it from the JWT Token or give a fallback UI Avatar if the token doesn't have one
        setUserAvatar(decoded.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name)}&background=random`);
      }
    }
  }, []);

  //? fetch grp details - push
  useEffect(() => {
    if (groupId) {
      const fetchGroup = async () => {
        try {
          const data = await getGroupDetails(groupId);
          setGroupData(data);
        } catch (error) {
          console.error("Error fetching group details:", error);
        }
      };
      fetchGroup();
    }
  }, [groupId]);
  console.log("groupData", groupData);


  const [messages, setMessages] = useState([]);
  // console.log("messages", messages)

  const [typingUsers, setTypingUsers] = useState([]);

  //? user online status
  const [onlineUsers, setOnlineUsers] = useState([]);

  //? ⭐ Convert backend → UI format - Vaish
  const mapMessage = (msg) => {
    //? grab sender details:
    // ID
    const senderId = typeof (msg.sender) === "object" ? msg.sender._id : msg.sender;
    // name
    const senderName = typeof (msg.sender) === "object" ? msg.sender.name : msg.name;
    // avatar
    const senderAvatar = typeof (msg.sender) === "object" ? msg.sender.avatar : msg.avatar;

    return {
      id: msg._id,
      sender: { _id: senderId, name: senderName, avatar: senderAvatar },
      // text content (may be empty for file/audio)
      content: msg.text || "",
      // ⭐ VERY IMPORTANT: keep original type (= 'audio' from SSE / DB)
      type: msg.type || (msg.fileUrl ? "file" : "text"),

      replyTo: msg.replyTo ? {
        id: msg.replyTo._id,
        text: msg.replyTo.text,
        type: msg.replyTo.type,
        fileUrl: msg.replyTo.fileUrl
      } : null,

      fileUrl: msg.fileUrl || null,
      fileName: msg.fileName || null,
      fileSize: msg.fileSize || null,

      name: senderName,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: msg.createdAt,
      mentions: msg.mentions || [],
      reactions: msg.reactions || [],
    };
  };


  // ⭐ Load initial messages
  //? fetch messages from backend
  useEffect(() => {
    if (!groupId || !loggedInUserId) return;

    const loadMessages = async () => {
      try {
        const data = await getGroupMessages(groupId);
        // console.log("normal messages------", data);
        setMessages(data.map(mapMessage));

      } catch (err) {
        console.log("Error loading messages", err);
      }
    };

    loadMessages();
  }, [groupId, loggedInUserId]);



  // -------------------------------------------------------
  //? ⭐ SSE Listener: messages + typing - Vaish
  // -------------------------------------------------------
  useEffect(() => {
    if (!groupId || !loggedInUserId) return;

    //? change SSE back, so it expects token data to perform authentication 
    //? grab token from localStorage
    const token = localStorage.getItem("token");

    const es = new EventSource(
      //? add token to the URL
      `http://localhost:5001/api/sse/stream/${groupId}?token=${token}`
    );

    // ----------------------------------------------------
    // ⭐ NAMED EVENTS LISTENERS
    // ----------------------------------------------------
    // 1. Initial Presence State
    //? Gets list of all users already online in this group
    es.addEventListener("initial_presence_state", (event) => {
      const users = JSON.parse(event.data);
      setOnlineUsers(users);
    });

    // 2. User Joined
    //? update state when a new user joins the group
    es.addEventListener("user_joined", (event) => {
      const newUser = JSON.parse(event.data);
      setOnlineUsers((prev) => {
        //? if userId is present in onlineUsers array then no need to add it again to the array
        //? helps when user is online from multiple tabs
        if (prev.some((u) => u.userId === newUser.userId)) return prev;
        return [...prev, newUser];
      });
    });

    // 3. User Left
    //? update state when a user leaves the group
    es.addEventListener("user_left", (event) => {
      const { userId } = JSON.parse(event.data);
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    // 4. Typing Event
    es.addEventListener("typing", (event) => {
      const data = JSON.parse(event.data);
      if (data.senderId !== loggedInUserId) {
        if (data.typing) {
          // show typing
          setTypingUsers([
            { senderId: data.senderId, name: data.userName, avatar: data.userAvatar },
          ]);
        } else {
          // hide typing
          setTypingUsers([]);
        }
      }
    });

    // 5. New Message Event
    es.addEventListener("new_message", (event) => {
      const data = JSON.parse(event.data);

      //*  Reaction update from SSE - added from vaish
      if (data.type === "updated-message") {
        console.log("🔁 SSE reaction update for:", data.messageId);

        // Re-fetch latest messages so all users see same reactions
        getGroupMessages(groupId)
          .then((dataFromApi) => {
            console.log("Refreshing messages after reaction");
            setMessages(dataFromApi.map(mapMessage));
          })
          .catch((err) => {
            console.error("Error refreshing messages after reaction:", err);
          });

        return;
      }

      const incomingSender = data.sender || data.senderId;

      if (incomingSender === loggedInUserId) return;

      if (data.type === "file" || data.type === "audio") {
        setMessages((prev) => [
          ...prev,
          {
            id: data._id,
            sender: { _id: data.sender, name: data.name, avatar: data.userAvatar },
            type: data.type,
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
            timestamp: new Date(data.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        setMessages((prev) => [...prev, mapMessage(data)]);
      }
    });



    es.onerror = () => {
      console.log("❌ SSE Disconnected");
      es.close();
    };

    // console.log("onlineUsers", onlineUsers);

    return () => es.close();
    //todo: when onlineUsers state is added in dependancy arr, console goes crazy- too many re-renders
  }, [groupId, loggedInUserId]);


  // -------------------------------------------------------
  //? ⭐ Send message
  // -------------------------------------------------------
  // ⭐ Centralized Message Handler
  const addMessageToState = (msg) => {
    let senderInfo;
    // if the msg var has info about sender 
    if (msg.sender && msg.sender._id) {
      // Use existing sender info
      senderInfo = msg.sender;
    }
    else {
      // If missing, use the current user's info for now
      senderInfo = {
        _id: loggedInUserId,
        name: username,
        avatar: userAvatar,
      }
    }
    // Create a new message object with the sender info included
    const enrichedMsg = {
      ...msg,
      sender: senderInfo,
    }

    // Check if the message is already in UI format (Optimistic) or needs mapping (Backend)
    // Optimistic messages already have 'id' and 'content'
    // Backend messages have '_id' and 'text'
    if (enrichedMsg.id && enrichedMsg.content !== undefined) {
      setMessages((prev) => [...prev, enrichedMsg]);
    } else {
      setMessages((prev) => [...prev, mapMessage(enrichedMsg)]);
    }
  };

  const handleSendMessage = async (text, options = {}) => {
    const { mentions = [], isUrgent = false } = options;

    // Optimistic UI update
    const optimisticMsg = {
      id: "local-" + Date.now(),
      sender: { _id: loggedInUserId, name: username, avatar: userAvatar },
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mentions,
      replyTo: replyMsg
        ? {
          id: replyMsg.id,
          text: replyMsg.content || replyMsg.text,  // keep this for text
          fileUrl: replyMsg.fileUrl || null,
          fileName: replyMsg.fileName || null,
          type: replyMsg.type || null
        }
        : null,
    };

    addMessageToState(optimisticMsg);
    // console.log("groupId in chatInput", groupId)

    // Actual backend request
    await sendGroupMessage({
      groupId,
      sender: loggedInUserId,
      avatar: userAvatar,
      text,
      mentions,
      isUrgent,
      name: username,
      replyTo: replyMsg?.id || replyMsg?._id || null // ← ADD THIS
    });
  };


  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <ChatHeader
        conversation={{ name: groupData?.name, id: groupId, avatar: groupData?.avatar }}
        onlineCount={onlineUsers.length} // ⭐ Pass online count
      // onClick={() => router.push(`/profile?groupId=${groupId}`)}
      />

      {/* Messages + Typing - ChatMain */}
      <div className="flex-1 overflow-hidden min-h-0 bg-gray-50 relative">
        <ChatMain
          messages={messages}
          setMessages={setMessages}
          userId={loggedInUserId}
          groupId={groupId}
          setReplyMsg={setReplyMsg}
        />
        {typingUsers.length > 0 && (
          <div className="flex items-end space-x-2 mb-3 px-2">
            {typingUsers.length === 1
              ? (<p className="text-sm font-bold text-emerald-500 ml-2"> {typingUsers.map((user) => user.name)} is typing... </p>)
              : (<p className="text-sm font-bold text-emerald-500 ml-2">
                {typingUsers.map((user) => user.name).join(", ")} are typing...
              </p>)
            }

            {/* Avatar */}
            {/* <img
              src={typingUsers[0].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(typingUsers[0].name)}&background=52D137&color=FFFFFF`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover ml-2"
            /> */}

            {/* Typing Bubble */}
            {/* <div className="bg-white border border-gray-300 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm flex items-center max-w-[75%]">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div> */}
          </div>
        )}
      </div>

      {/* Input- ChatInput */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onMessageSuccess={addMessageToState}
        groupId={groupId}
        senderId={loggedInUserId}
        userName={username}
        userAvatar={userAvatar}
        replyPreview={replyMsg}
        clearReply={() => setReplyMsg(null)}
      />
    </div>
  );
};

export default ChatMsg;
