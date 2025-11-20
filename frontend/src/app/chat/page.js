"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatHistory from "../../components/ChatHistory";
import ChatBox from "../../components/ChatBox";
import { FiMenu, FiX } from "react-icons/fi";

export default function ChatPage() {
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [refreshChatBox, setRefreshChatBox] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setSidebarOpen(false);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setRefreshChatBox((prev) => !prev);
  };

  return (
    <div className="h-screen flex bg-gray-100 relative overflow-hidden">

      {/* ⭐ Hamburger always visible */}
      <button
        className="absolute top-2 left-2 z-50 p-2 bg-white rounded-full shadow-md cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu size={22} />
      </button>

      {/* 🌙 Overlay behind sidebar ONLY (NO BLUR TO CHATBOX) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-40 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
    fixed top-0 left-0 h-screen w-72 bg-white 
    z-50 border-r border-gray-200
    transform transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-full shadow-md cursor-pointer mt-8"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX size={22} />
        </button>

        <ChatHistory
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversationId}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* 💬 Main Chat Area (should NOT blur or move when sidebar opens) */}
    <div className="flex-1 flex flex-col w-full h-full relative z-20">

        <ChatBox
          key={
            refreshChatBox
              ? "refresh"
              : selectedConversationId || "default"
          }
          conversationId={selectedConversationId}
        />
      </div>
    </div>
  );
}
