"use client";

import { useState ,useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import ChatInput from "../../components/GroupChatBox.jsx"

export default function ChatPage() {
  const [senderId , setSenderId]= useState()
   useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token)

    if (token) {
      const decoded = jwtDecode(token);
      console.log("decode data " , decoded)
      setSenderId(decoded.id); // depends on backend
    }
    console.log("senderId from groupChat",senderId)
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ChatInput
        groupId="692702e03bac5eec96570535"
        senderId={senderId}
        onMessageSent={() => console.log("Message saved")}
      />
    </div>
  );
}
