
// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   searchGroupMembers,
//   sendGroupMessage,
//   getGroupMessages
// } from "@/utils/api";

// export default function ChatInput({ groupId, senderId }) {
//   const [text, setText] = useState("");
//   const [mentions, setMentions] = useState([]);

//   const [showDropdown, setShowDropdown] = useState(false);
//   const [results, setResults] = useState([]);

//   const [messages, setMessages] = useState([]);
//   const [loadingMessages, setLoadingMessages] = useState(false);

//   const inputRef = useRef();

//   // -----------------------------
//   // Load messages on mount
//   // -----------------------------

//   //  console.log("message send id frontend", typeof(messages.sender._id))
//   //     console.log("message send id backend", typeof(senderId))
//   const loadMessages = async () => {
//     if (!groupId) return;
//     setLoadingMessages(true);

//     const eventSource = new EventSource(
//       `http://localhost:5000/api/sse/stream/${groupId}`
//     );


//     eventSource.onmessage = (event) => {
//       const newMessage = JSON.parse(event.data);

//       setMessages(prev => [...prev, newMessage]);
//       setLoadingMessages(false);
//     };

//     eventSource.onerror = () => {
//       console.log("❌ SSE connection lost");
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };

//   };

//   useEffect(() => {
//     loadMessages();
//   }, [groupId]);




//   // useEffect(() => {
//   //   if (!groupId) return;
//   //   setLoadingMessages(true);

//   //   const eventSource = new EventSource(
//   //     `http://localhost:5000/api/sse/stream/${groupId}`
//   //   );


//   //   eventSource.onmessage = (event) => {
//   //     const newMessage = JSON.parse(event.data);

//   //     setMessages(prev => [...prev, newMessage]);
//   //     setLoadingMessages(false);
//   //   };

//   //   eventSource.onerror = () => {
//   //     console.log("❌ SSE connection lost");
//   //     eventSource.close();
//   //   };

//   //   return () => {
//   //     eventSource.close();
//   //   };
//   // }, [groupId]);


//   // -----------------------------
//   // Mention Search System
//   // -----------------------------
//   const handleInputChange = async (e) => {
//     const value = e.target.value;
//     setText(value);

//     const lastAt = value.lastIndexOf("@");

//     if (lastAt === -1) {
//       setShowDropdown(false);
//       return;
//     }

//     const query = value.slice(lastAt + 1);

//     if (query.trim() === "") {
//       const members = await searchGroupMembers(groupId, "");
//       console.log("members from frontend", members)
//       setResults(members);
//       setShowDropdown(true);
//       return;
//     }

//     const list = await searchGroupMembers(groupId, query);
//     setResults(list);
//     setShowDropdown(true);
//   };

//   const handleSelectMention = (user) => {
//     const lastAt = text.lastIndexOf("@");
//     const before = text.substring(0, lastAt);

//     const newValue = before + "@" + user.name + " ";
//     setText(newValue);

//     if (!mentions.includes(user._id)) {
//       setMentions((prev) => [...prev, user._id]);
//     }

//     setShowDropdown(false);
//     inputRef.current?.focus();
//   };


//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessageHandler();  // submit your form
//     }
//   };

//   // -----------------------------
//   // Send Message
//   // -----------------------------
//   const sendMessageHandler = async (e) => {


//     if (!text.trim()) return;

//     await sendGroupMessage({
//       groupId,
//       sender: senderId,
//       text,
//       mentions
//     });

//     setText("");
//     setMentions([]);
//     inputRef.current?.focus();

//     // Reload messages after sending
//     await loadingMessages();
//   };

//   return (
//     <div className="w-full p-4">


//       {/* ----------------- Messages List ----------------- */}
//       <div className="p-3 mb-4 overflow-y-auto border rounded-lg max-h-80 bg-gray-50">

//         {loadingMessages ? (
//           <div className="text-center text-gray-500">Loading messages...</div>
//         ) : messages.length === 0 ? (
//           <div className="text-center text-gray-400">No messages yet.</div>
//         ) : (
//           messages.map((msg) => {


//             const isSender = msg.sender?._id === senderId;

//             return (
//               <div
//                 key={msg._id}
//                 className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
//               >
//                 {/* Avatar */}
//                 {!isSender && (
//                   <div className="flex items-center justify-center mr-3 text-white bg-gray-700 rounded-full w-9 h-9">
//                     {msg.sender?.name?.charAt(0)?.toUpperCase() || "You"}
//                   </div>
//                 )}

//                 {/* Chat Bubble */}
//                 <div
//                   className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow 
//               ${isSender ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}
//                 >
//                   <p className={`text-sm ${isSender ? "text-white/80" : "text-gray-500"}`}>
//                     {msg.sender?.name}
//                   </p>

//                   <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
//                 </div>

//                 {/* Sender avatar (right side) */}
//                 {isSender && (
//                   <div className="flex items-center justify-center ml-3 text-white bg-blue-600 rounded-full w-9 h-9">
//                     U
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>


//       {/* ----------------- Input Box ----------------- */}
//       <div className="relative flex justify-center items-center flex-col">
//         <textarea
//           ref={inputRef}
//           value={text}
//           placeholder="Type @ to mention someone..."
//           onChange={handleInputChange}
//           onKeyDown={handleKeyPress}
//           className="w-full p-3 mb-2 border rounded"
//           rows={3}
//         />

//         {showDropdown && results.length > 0 && (
//           <ul className="absolute z-20 w-64 overflow-y-auto bg-white border rounded shadow-lg max-h-60">
//             {results.map((user) => (
//               <li
//                 key={user._id}
//                 className="p-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSelectMention(user)}
//               >
//                 {user.name}
//               </li>
//             ))}
//           </ul>
//         )}

//         <button
//           onClick={sendMessageHandler}
//           className="flex justify-center items-center flex-column text-white bg-blue-600 rounded-2xl cursor-pointer py-2 w-75 hover:bg-blue-700 "
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }









"use client";

import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  searchGroupMembers,
  sendGroupMessage,
  getGroupMessages
} from "@/utils/api";

export default function ChatInput({ groupId, senderId }) {
  const [text, setText] = useState("");
  const [mentions, setMentions] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const inputRef = useRef();

  // ----------------------------------------------------
  // LOAD INITIAL MESSAGES (VERY IMPORTANT)
  // ----------------------------------------------------

  useEffect(() => {

    if (!groupId) return;

    async function loadInitialMessages() {
      setLoadingMessages(true);
      try {
        const data = await getGroupMessages(groupId);
        console.log("cheack for username data", data)
        // console.log(data.sender.name)
        setMessages(data);
      } finally {
        setLoadingMessages(false);
      }
    }

    loadInitialMessages();
  }, [groupId]);

  // ----------------------------------------------------
  // SSE REAL TIME STREAM
  // ----------------------------------------------------
  useEffect(() => {
    if (!groupId) return;

    const eventSource = new EventSource(
      `http://localhost:5000/api/sse/stream/${groupId}`
    );

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("messages data", newMessage)

      // Fix sender mismatch: SSE returns sender as STRING
      setMessages((prev) => [...prev, newMessage]);
    };

    eventSource.onerror = () => {
      console.log("❌ SSE disconnected");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [groupId]);

  // ----------------------------------------------------
  // Mention Search System
  // ----------------------------------------------------
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setText(value);

    const lastAt = value.lastIndexOf("@");

    if (lastAt === -1) return setShowDropdown(false);

    const query = value.slice(lastAt + 1);

    if (query.trim() === "") {
      const members = await searchGroupMembers(groupId, "");
      setResults(members);
      setShowDropdown(true);
      return;
    }

    const list = await searchGroupMembers(groupId, query);
    setResults(list);
    setShowDropdown(true);
  };

  const handleSelectMention = (user) => {
    const lastAt = text.lastIndexOf("@");
    const before = text.substring(0, lastAt);

    const newValue = before + "@" + user.name + " ";
    setText(newValue);

    if (!mentions.includes(user._id)) {
      setMentions((prev) => [...prev, user._id]);
    }

    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // ENTER to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  // ----------------------------------------------------
  // Send Message
  // ----------------------------------------------------
  const sendMessageHandler = async () => {

    const token = localStorage.getItem("token");
    const currentUser = token ? jwtDecode(token) : null;
    console.log("current user from token localstorage" , currentUser.name)
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

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="w-full p-4">
      {/* ----------------- Messages List ----------------- */}
      <div className="p-3 mb-4 overflow-y-auto border rounded-lg max-h-80 bg-gray-50">
        {loadingMessages ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet.</div>
        ) : (
          messages.map((msg) => {
            // FIX: handle sender from SSE
            const senderIdFromMsg =
              typeof msg.sender === "string"
                ? msg.sender
                : msg.sender?._id;

            const isSender = senderIdFromMsg === senderId;

            return (
              <div
                key={msg._id}
                className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
              >
                {!isSender && (
                  <div className="flex items-center justify-center mr-3 text-white bg-gray-700 rounded-full w-9 h-9">
                    {msg.sender?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow ${isSender
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                >
                  <p className={`text-sm ${isSender ? "text-white/80" : "text-gray-500"}`}>
                    {msg.sender?.name || "You"}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
                </div>

                {isSender && (
                  <div className="flex items-center justify-center ml-3 text-white bg-blue-600 rounded-full w-9 h-9">
                    U
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ----------------- Input Box ----------------- */}
      <div className="relative flex justify-center items-center flex-col">
        <textarea
          ref={inputRef}
          value={text}
          placeholder="Type @ to mention someone..."
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="w-full p-3 mb-2 border rounded"
          rows={3}
        />

        {showDropdown && results.length > 0 && (
          <ul className="absolute z-20 w-64 overflow-y-auto bg-white border rounded shadow-lg max-h-60">
            {results.map((user) => (
              <li
                key={user._id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectMention(user)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={sendMessageHandler}
          className="flex justify-center items-center text-white bg-blue-600 rounded-2xl cursor-pointer py-2 w-full hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
