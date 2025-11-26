
// "use client";

// import React, { useEffect, useRef } from "react";

// const ChatMain = ({ messages, userId }) => {
//   const messagesEndRef = useRef(null);
//   const scrollContainerRef = useRef(null);

//   useEffect(() => {
//     setTimeout(() => {
//       if (messagesEndRef.current) {
//         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//       } else if (scrollContainerRef.current) {
//         scrollContainerRef.current.scrollTop =
//           scrollContainerRef.current.scrollHeight;
//       }
//     }, 50);
//   }, [messages]);

//   const renderMessage = (message) => {
//     // ⭐ SENT or RECEIVED based on userId
//     console.log("senderId" , message.sender)
//     console.log("userId" , userId)
//     const type = message.sender._id === userId ? "sent" : "received";
   

//     switch (type) {
//       case "received":
//         return (
//           <div key={message.id}  className="flex items-start space-x-3 mb-4">
//             <img
//               // src="https://ui-avatars.com/api/?name=User&background=52D137&color=FFFFFF"
//               className="w-8 h-8 rounded-full object-cover"
//             />
//             <div>
//               <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[28rem] shadow-sm">
//                 <p className="text-black text-base">{message.content}</p>
//               </div>
//               <span className="text-sm text-gray-500 mt-1">{message.timestamp}</span>
//             </div>
//           </div>
//         );

//       case "sent":
//         return (
//           <div key={message.id} className="flex justify-end mb-4 " >
//             <div className="flex flex-col items-end max-w-md">
//               <div className="bg-black text-white rounded-xl px-4 py-3 max-w-[28rem] shadow-md">
//                 <p className="text-base">{message.content}</p>
//               </div>
//               <span className="text-sm text-gray-500 mt-1">{message.timestamp}</span>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       ref={scrollContainerRef}
//       className="h-full overflow-y-auto px-4 sm:px-6 pt-0 pb-4 bg-gray-50 scrollbar-hide"
//     >
//       <div className="max-w-4xl mx-auto">
//         {messages.map(renderMessage)}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// };

// export default ChatMain;



"use client";

import React, { useEffect, useRef } from "react";

const ChatMain = ({ messages, userId }) => {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }, [messages]);

  // ⭐ Normalize sender ID & name (backend sometimes sends object/string)
  const getSenderId = (sender) => {
    if (!sender) return null;
    if (typeof sender === "string") return sender;
    if (typeof sender === "object") return sender._id;
    return null;
  };

  const getSenderName = (sender) => {
    if (!sender) return "User";
    if (typeof sender === "object") return sender.name || "User";
    return "User";
  };

  const renderMessage = (message) => {
    console.log("mesage" , message)
    const senderId = getSenderId(message.sender);
    const senderName = getSenderName(message.sender);

    // ⭐ Determine sent/received
    const type = senderId === userId ? "sent" : "received";

    // ⭐ Create dynamic avatar
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      senderName
    )}&background=52D137&color=FFFFFF`;

    switch (type) {
      case "received":
        return (
          <div key={message.id} className="flex items-start space-x-3 mb-4">
            <img
              src={avatarUrl}
              alt={senderName}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div>
              <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[28rem] shadow-sm">
                <p className="text-black text-base">{message.content}</p>
              </div>

              <span className="text-sm text-gray-500 mt-1 block">
                {message.timestamp}
              </span>
            </div>
          </div>
        );

      case "sent":
        return (
          <div key={message.id} className="flex justify-end mb-4">
            <div className="flex flex-col items-end max-w-md">
              {/* <img
              src="https://ui-avatars.com/api/?name=User&background=52D137&color=FFFFFF"
              className="w-8 h-8 rounded-full object-cover"
            /> */}

              <div className="bg-black text-white rounded-xl px-4 py-3 max-w-[28rem] shadow-md">
                <p className="text-base">{message.content}</p>
              </div>

              <span className="text-sm text-gray-500 mt-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-4 sm:px-6 pt-0 pb-4 bg-gray-50 scrollbar-hide"
    >
      <div className="max-w-4xl mx-auto">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMain;
