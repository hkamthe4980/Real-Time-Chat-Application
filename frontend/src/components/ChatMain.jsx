//* vaish
"use client";

import React, { useState, useEffect, useRef } from "react";
import { SiAudiobookshelf } from "react-icons/si";
import { MdDownloading } from "react-icons/md";


// for  reaction
const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
const getMessageId = (message) => message._id || message.id;


const ChatMain = ({ messages, setMessages, userId, typingUsers = [], groupId, setReplyMsg }) => {
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    // ⭐ FULLSCREEN IMAGE PREVIEW MODAL STATE
    const [previewImage, setPreviewImage] = useState(null);

    const closePreview = () => setPreviewImage(null);

    // for  reaction
    const [activeReactionFor, setActiveReactionFor] = useState(null);
    const longPressTimerRef = useRef(null);
    const [disableScroll, setDisableScroll] = useState(false);

    
    

useEffect(() => {
  console.log("GROUP ID RECEIVED IN CHATMAIN:", groupId);
}, [groupId]);



    // Auto-scroll on new messages
    useEffect(() => {
       if (disableScroll) return;
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 50);
    }, [messages, typingUsers, disableScroll]);

// for  reaction
    const handleTouchStart = (e, messageId) => {
  e.stopPropagation();
//   e.preventDefault();
  longPressTimerRef.current = setTimeout(() => {
    setActiveReactionFor(messageId);
    setDisableScroll(true);
  }, 500);
};

const handleTouchEnd = (e) => {
  e.stopPropagation();
//   e.preventDefault();

  clearTimeout(longPressTimerRef.current);
  setDisableScroll(false);
};

// const handleRightClick = (e, messageId) => {
//   e.preventDefault();
//   e.stopPropagation();
//   setActiveReactionFor(messageId);
// };

const sendReaction = async (messageId, emoji) => {
  //  UI update
  setMessages(prev =>
    prev.map(msg =>
     getMessageId(msg) === messageId
        ? {
            ...msg,
            reactions: [
              ...(msg.reactions?.filter(r => r.userId !== userId) || []),
              { userId, emoji }
            ]
          }
        : msg
    )
  );

  // Close popup
  setActiveReactionFor(null);

  // Send request to backend
  const token = localStorage.getItem("token");
 

  await fetch("http://localhost:5001/api/messages/react", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messageId,
      userId,
      groupId,
      emoji,
    }),
  });
};



    // ⭐ Normalize sender ID & name (backend sometimes sends object/string)
    const getSenderId = (sender) => {
        if (!sender) return null;
        if (typeof (sender) === "string") return sender;
        if (typeof (sender) === "object") return sender._id;
        return null;
    };

    const getSenderName = (sender) => {
        if (!sender) return "User";
        if (typeof (sender) === "object") return sender.name || "User";
        return "User";
    };

    const getSenderAvatar = (sender) => {
        if (!sender || typeof (sender) !== "object") return null;
        return sender.avatar;
    };

    // for  reaction
   const ReactionPopup = ({ messageId }) => (
  <div className="absolute top-10 left-0 bg-white border shadow-lg rounded-full px-3 py-1 z-50 flex space-x-2">
    {REACTIONS.map((emoji) => (
      <span
        key={emoji}
        className="text-xl cursor-pointer hover:scale-125 transition"
        onClick={() => sendReaction(messageId, emoji)}  
      >
        {emoji}
      </span>
    ))}
  </div>
);


const ReactionSummary = ({ reactions }) => {
  if (!reactions || reactions.length === 0) return null;

  const grouped = reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className=" bg-white shadow px-2 py-1 rounded-full w-fit flex space-x-1">
      {Object.entries(grouped).map(([emoji, count]) => (
        <span key={emoji} className="text-sm">
          {emoji} {count > 1 ? count : ""}
        </span>
      ))}
    </div>
  );
};


    // -------------------------------
    // ⭐ RENDER FILE MESSAGE
    // -------------------------------

    // const renderFileMessage = (message, type, avatarUrl) => {
    //     const fileUrl = `http://localhost:5001${message.fileUrl}`;
    //     return (
    //         <div
    //             key={message.id}
    //             className={`flex ${type === "sent" ? "justify-end" : "items-start space-x-2"
    //                 } mb-3`}
    //         >
    //             {/* Avatar for received messages */}
    //             {type === "received" && (
    //                 <img
    //                     src={avatarUrl}
    //                     alt={message.sender.name}
    //                     className="w-8 h-8 rounded-full"
    //                 />
    //             )}

    //             {/* File bubble */}
    //             <div className="max-w-[75%]">
    //                 <div
    //                     className={`relative rounded-2xl px-2 pr-2 pb-2 pt-2 shadow-sm border ${type === "received"
    //                         ? "bg-white border-gray-300 rounded-bl-sm"
    //                         : "bg-black text-white border-black rounded-br-sm"
    //                         }`}
    //                 >
    //                     {/* ⭐ Image preview */}
    //                     {message.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
    //                         <img
    //                             src={fileUrl}
    //                             alt="preview"
    //                             className="w-40 rounded mb-2 cursor-pointer hover:opacity-90"
    //                             onClick={() => setPreviewImage(fileUrl)}
    //                         />
    //                     ) : (
    //                         <p className="font-semibold mb-1">{message.fileName}</p>
    //                     )}

    //                     {/* Download link */}
    //                     <a
    //                         href={fileUrl}
    //                         download
    //                         className={`text-sm underline ${type === "sent" ? "text-blue-300" : "text-blue-600"
    //                             }`}
    //                     >
    //                         Download
    //                     </a>

    //                     {/* ⭐ Timestamp inside bubble (no overlap) */}
    //                     <span
    //                         className={`absolute bottom-1 right-2 text-[9px] ${type === "sent" ? "text-gray-300" : "text-gray-500"
    //                             } px-1`}
    //                     >
    //                         {message.timestamp}
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    const renderFileMessage = (message, type, avatarUrl) => {
  const fileUrl = `http://localhost:5001${message.fileUrl}`;
  const msgId = getMessageId(message);   
  return (
    <div
     key={msgId}

      className={`flex ${
        type === "sent" ? "justify-end" : "items-start space-x-2"
      } mb-3`}
    >
      {/* Avatar for received messages */}
      {type === "received" && (
        <img
          src={avatarUrl}
          alt={message.sender?.name}
          className="w-8 h-8 rounded-full"
        />
      )}

      {/* File bubble wrapper */}
      <div className="max-w-[75%] relative  group flex items-center gap-2">

        {/* ⭐ Reaction Popup */}
        {activeReactionFor ===  msgId && (
          // <ReactionPopup messageId={message._id} />
          <ReactionPopup messageId={msgId} />
        )}

        {/* ⭐ Bubble with long press + right click */}
        <div
          className={`relative rounded-2xl px-2 pr-2 pb-2 pt-2 shadow-sm border group ${
            type === "received"
              ? "bg-white border-gray-300 rounded-bl-sm"
              : "bg-black text-white border-black rounded-br-sm"
          }`}
          // onContextMenu={(e) => handleRightClick(e, message._id)} // desktop
          onTouchStart={(e) => handleTouchStart(e, msgId)}  // mobile hold
          onTouchEnd={(e) => handleTouchEnd(e)}                   // release
        >

           {/* ⭐ Reply Icon */}
   <span
  onClick={() => setReplyMsg(message)}
  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 
             text-gray-300 hover:text-gray-500 cursor-pointer text-sm 
             transition duration-200 z-50"
>↩</span>
   {message.replyTo && (
  <div className="bg-gray-200 rounded p-1 mb-1 border-l-4 border-blue-500 text-xs text-gray-700">

     Replying to: <span className="font-semibold">
      {message.replyTo.text?.slice(0,40)
       || message.replyTo.fileName?.slice(0,30)
       || (message.replyTo.type === "audio" ? "🎵 Audio Message" : null)
       || (message.replyTo.type === "file" ? "📎 File Attachment" : null)      }
     </span>
  </div>
)}
          {/* ⭐ Image preview */}
          {message.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img
              src={fileUrl}
              alt="preview"
              className="w-40 rounded mb-2 cursor-pointer hover:opacity-90"
              onClick={() => setPreviewImage(fileUrl)}
            />
          ) : (
            <p className="font-semibold mb-1">{message.fileName}</p>
          )}

          {/* Download link */}
          <a
            href={fileUrl}
            download
            className={`text-sm underline ${
              type === "sent" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            Download
          </a>

          {/* ⭐ Timestamp */}
          <span
            className={`absolute bottom-1 right-2 text-[9px] ${
              type === "sent" ? "text-gray-300" : "text-gray-500"
            } px-1`}
          >
            {message.timestamp}
          </span>
        </div>

        {/* ⭐ Reaction Summary (emoji shown below bubble) */}
        <ReactionSummary reactions={message.reactions} />
      </div>
    </div>
  );
};


    // -------------------------------
    // ⭐ RENDER TEXT MESSAGE
    // -------------------------------
    // const renderTextMessage = (message, type, avatarUrl) => {
    //     const senderName = getSenderName(message.sender);

    //     return type === "received" ? (
    //         <div key={message.id} className="flex items-start space-x-2 mb-3">
    //             {/* Avatar */}
    //             <img
    //                 src={avatarUrl}
    //                 alt={senderName}
    //                 className="w-8 h-8 rounded-full"
    //             />

    //             {/* Message bubble & timestamp */}
    //             <div className="max-w-[75%]">
    //                 <div className="bg-white text-black rounded-2xl rounded-bl-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative">
    //                     <p className="text-[15px] leading-snug">{message.content}</p>

    //                     <span className="text-[9px] text-gray-400 absolute bottom-1 right-2 px-2">
    //                         {message.timestamp}
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>
    //     ) : (
    //         <div key={message.id} className="flex justify-end mb-3">
    //             {/* Message bubble & timestamp */}
    //             <div className="max-w-[75%]">
    //                 <div className="bg-black text-white rounded-2xl rounded-br-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative">
    //                     <p className="text-[15px] leading-snug">{message.content}</p>

    //                     <span className="text-[9px] text-gray-300 absolute bottom-1 right-2 px-1">
    //                         {message.timestamp}
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

    const renderTextMessage = (message, type, avatarUrl) => {
  const senderName = getSenderName(message.sender);
    const msgId = getMessageId(message);   // 🔹 unified id

  // RECEIVED MESSAGE
  if (type === "received") {
    return (
      <div key={msgId}
className="flex items-start space-x-2 mb-3">
        {/* Avatar */}
        <img src={avatarUrl} alt={senderName} className="w-8 h-8 rounded-full" />

        {/* Wrapper */}
        <div className="max-w-[75%] relative ">

          {/* ⭐ Reaction Popup */}
          {activeReactionFor === msgId && (
            <ReactionPopup messageId={msgId} />
          )}

          {/* ⭐ Bubble with handlers */}
          <div
            className="bg-white text-black rounded-2xl rounded-bl-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative group"
            // onContextMenu={(e) => handleRightClick(e, msgId)}  // desktop
            onTouchStart={(e) => handleTouchStart(e, msgId)}   // mobile
            onTouchEnd={(e) => handleTouchEnd(e)}                    // mobile
          >

          <span
  onClick={() => setReplyMsg(message)}
  className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 
             text-gray-600 hover:text-black cursor-pointer text-sm 
             transition duration-200 z-50"
>↩</span>
   {message.replyTo && (
  <div className="bg-gray-200 rounded p-1 mb-1 border-l-4 border-blue-500 text-xs text-gray-700">

     Replying to: <span className="font-semibold">
      {message.replyTo.text?.slice(0,40)
       || message.replyTo.fileName?.slice(0,30)
       || (message.replyTo.type === "audio" ? "🎵 Audio Message" : null)
       || (message.replyTo.type === "file" ? "📎 File Attachment" : null)      }
     </span>
  </div>
)}
            <p className="text-[15px] leading-snug">{message.content}</p>

            <span className="text-[9px] text-gray-400 absolute bottom-1 right-2 px-2">
              {message.timestamp}
            </span>
          </div>

          {/* ⭐ Reaction Summary */}
          <ReactionSummary reactions={message.reactions} />
        </div>
      </div>
    );
  }

  // SENT MESSAGE
  return (
    <div key={msgId} className="flex justify-end mb-3">
      <div className="max-w-[75%] relative">

        {/* ⭐ Reaction Popup */}
        {activeReactionFor === msgId && (
          <ReactionPopup messageId={msgId} />
        )}

        {/* ⭐ Bubble with handlers */}
        <div
          className="bg-black text-white rounded-2xl rounded-br-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative group"
          // onContextMenu={(e) => handleRightClick(e, msgId)}   // desktop
          onTouchStart={(e) => handleTouchStart(e, msgId)}    // mobile
          onTouchEnd={(e) => handleTouchEnd(e)}                     // mobile
        >
        <span
  onClick={() => setReplyMsg(message)}
  className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 
             text-gray-600 hover:text-black cursor-pointer text-sm 
             transition duration-200 z-50"
>↩</span>

  {message.replyTo && (
  <div className="bg-gray-200 rounded p-1 mb-1 border-l-4 border-blue-500 text-xs text-gray-700">

     Replying to: <span className="font-semibold">
      {message.replyTo.text?.slice(0,40)
       || message.replyTo.fileName?.slice(0,30)
       || (message.replyTo.type === "audio" ? "🎵 Audio Message" : null)
       || (message.replyTo.type === "file" ? "📎 File Attachment" : null)      }
     </span>
  </div>
)}
          <p className="text-[15px] leading-snug">{message.content}</p>

          <span className="text-[9px] text-gray-300 absolute bottom-1 right-2 px-1">
            {message.timestamp}
          </span>
        </div>

        {/* ⭐ Reaction Summary */}
        <ReactionSummary reactions={message.reactions} />
      </div>
    </div>
  );
};



    // -------------------------------
    // ⭐ RENDER AUDIO MESSAGE 
    // ------------------------------
    // const renderAudioMessage = (message, type, avatarUrl) => {
    //     const audioUrl = `http://localhost:5001${message.fileUrl}`;
    //     const isSent = type === "sent";

    //     return (
    //         <div
    //             key={message.id}
    //             className={`flex ${isSent ? "justify-end" : "items-start space-x-2"
    //                 } mb-3`}
    //         >
    //             {/* Avatar for received */}
    //             {!isSent && (
    //                 <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
    //             )}

    //             {/* Bubble */}
    //             <div className="max-w-[75%]">
    //                 <div
    //                     className={`relative rounded-2xl px-2 pr-2 pb-2 pt-2 shadow-sm border flex items-center space-x-2 ${isSent
    //                         ? "bg-black text-white border-black rounded-br-sm"
    //                         : "bg-white text-black border-gray-300 rounded-bl-sm"
    //                         }`}
    //                 >
    //                     {/* Play button */}
    //                     <button
    //                         className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
    //                         onClick={(e) => {
    //                             const audio = e.currentTarget.parentNode.querySelector("audio");
    //                             if (audio.paused) audio.play();
    //                             else audio.pause();
    //                         }}
    //                     >
    //                         <SiAudiobookshelf className="text-black" />
    //                     </button>

    //                     {/* Audio element */}
    //                     <audio
    //                         src={audioUrl}
    //                         controls
    //                         className="h-10"
    //                         style={{
    //                             filter: isSent ? "invert(1)" : "none",
    //                         }}
    //                     />

    //                     {/* Download button */}
    //                     <a
    //                         href={audioUrl}
    //                         download={message.fileName}
    //                         className="text-sm underline"
    //                     >
    //                         <MdDownloading className={`${isSent ? "text-white" : "text-black"} h-5 w-5`} />
    //                     </a>

    //                     {/* ⭐ Timestamp inside bubble  */}
    //                     <span
    //                         className={`absolute bottom-1 right-2 text-[9px] pt-2 ${isSent ? "text-gray-300" : "text-gray-500"
    //                             } px-1`}
    //                     >
    //                         {message.timestamp}
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };
    const renderAudioMessage = (message, type, avatarUrl) => {
  const audioUrl = `http://localhost:5001${message.fileUrl}`;
  const isSent = type === "sent";
  const msgId = getMessageId(message);   // 🔹 unified id

  return (
    <div
      key={msgId}
      className={`flex ${
        isSent ? "justify-end" : "items-start space-x-2"
      } mb-3`}
    >
      {/* Avatar for received */}
      {!isSent && (
        <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
      )}

      {/* Bubble wrapper */}
      <div className="max-w-[75%] relative">

        {/* ⭐ Reaction Popup */}
        {activeReactionFor === msgId && (
          <ReactionPopup messageId={msgId} />
        )}

        {/* Bubble with handlers */}
        <div
          className={`relative rounded-2xl px-2 pr-2 pb-2 pt-2 shadow-sm border flex items-center space-x-2 group ${
            isSent
              ? "bg-black text-white border-black rounded-br-sm"
              : "bg-white text-black border-gray-300 rounded-bl-sm"
          }`}
          // onContextMenu={(e) => handleRightClick(e, msgId)} // desktop
          onTouchStart={(e) => handleTouchStart(e, msgId)}  // mobile
          onTouchEnd={(e) => handleTouchEnd(e)}                   // mobile
        >

 {/* ⭐ Reply Icon */}
  <span
  onClick={() => setReplyMsg(message)}
  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 
             text-gray-400 hover:text-black cursor-pointer text-sm 
             transition duration-200 z-50"
>↩</span>

   {message.replyTo && (
  <div className="bg-gray-200 rounded p-1 mb-1 border-l-4 border-blue-500 text-xs text-gray-700">

     Replying to: <span className="font-semibold">
      {message.replyTo.text?.slice(0,40)
       || message.replyTo.fileName?.slice(0,30)
       || (message.replyTo.type === "audio" ? "🎵 Audio Message" : null)
       || (message.replyTo.type === "file" ? "📎 File Attachment" : null)      }
     </span>
  </div>
)}

          {/* Play button */}
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={(e) => {
              const audio =
                e.currentTarget.parentNode.querySelector("audio");
              if (audio.paused) audio.play();
              else audio.pause();
            }}
          >
            <SiAudiobookshelf className="text-black" />
          </button>

          {/* Audio element */}
          <audio
            src={audioUrl}
            controls
            className="h-10"
            style={{ filter: isSent ? "invert(1)" : "none" }}
          />

          {/* Download button */}
          <a
            href={audioUrl}
            download={message.fileName}
            className="text-sm underline"
          >
            <MdDownloading
              className={`${isSent ? "text-white" : "text-black"} h-5 w-5`}
            />
          </a>

          {/* ⭐ Timestamp inside bubble */}
          <span
            className={`absolute bottom-1 right-2 text-[9px] pt-2 ${
              isSent ? "text-gray-300" : "text-gray-500"
            } px-1`}
          >
            {message.timestamp}
          </span>
        </div>

        {/* ⭐ Reaction Summary below bubble */}
        <ReactionSummary reactions={message.reactions} />
      </div>
    </div>
  );
};




    const renderMessage = (message) => {
        console.log("mesage", message)
        const senderId = getSenderId(message.sender);
        const senderName = getSenderName(message.sender);
        const senderAvatar = getSenderAvatar(message.sender);

        // ⭐ Determine sent/received
        const type = senderId === userId ? "sent" : "received";

        // ⭐ Create dynamic avatar (Unified logic for all message types)
        console.log("senderAvatar:", senderAvatar);
        const avatarUrl = senderAvatar;

        // ⭐ FIRST check AUDIO
        if (message.type === "audio") {
            return renderAudioMessage(message, type, avatarUrl);
        }

        // ⭐ THEN check FILE
        if (message.type === "file") {
            return renderFileMessage(message, type, avatarUrl);
        }

        // ⭐ FALLBACK → TEXT
        return renderTextMessage(message, type, avatarUrl);
    };


    return (
      <div>
        {/*closes popup on click */}
       {activeReactionFor && (
      <div
        className="fixed inset-0 z-40"
        onClick={() => setActiveReactionFor(null)}
      />
    )}
        <div
            ref={scrollContainerRef}
        className={`h-full px-4 sm:px-6 pt-0 pb-4 bg-gray-50 scrollbar-hide ${
        disableScroll ? "overflow-hidden" : "overflow-y-auto"
  }`}
        >
            <div className="max-w-4xl mx-auto">
                {messages.map(renderMessage)}

                <div ref={messagesEndRef} />
            </div>
            {/* ⭐ FULLSCREEN IMAGE VIEW MODAL ⭐ */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
                    onClick={closePreview}
                >
                    <img
                        src={previewImage}
                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
                        alt="Full View"
                    />

                    {/* Close button */}
                    <button
                        onClick={closePreview}
                        className="absolute top-6 right-6 text-white text-3xl "
                    >
                        ✖
                    </button>
                </div>
            )}
        </div>

      </div>
    );
};

export default ChatMain;
