"use client";
import { useEffect, useState } from "react";
import { fetchChatHistory, getConversationMessages, deleteConversation, summarizeConversation, startNewConversation } from "../utils/api";

export default function ChatHistory({ onSelectConversation, selectedConversationId, onNewConversation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedConv, setExpandedConv] = useState(null);
  const [messages, setMessages] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  // Load conversation list
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetchChatHistory(50, false);
        setConversations(res.conversations || []);
      } catch (err) {
        console.error("❌ Error loading chat history:", err);
        setError("Failed to load chat history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Load messages for expanded conversation
  const loadMessages = async (conversationId) => {
    if (messages[conversationId]) return;
    
    try {
      const res = await getConversationMessages(conversationId);
      setMessages(prev => ({
        ...prev,
        [conversationId]: res.messages || []
      }));
    } catch (err) {
      console.error("❌ Error loading messages:", err);
    }
  };

  // Toggle conversation expansion
  const toggleConversation = async (conversationId) => {
    if (expandedConv === conversationId) {
      setExpandedConv(null);
    } else {
      setExpandedConv(conversationId);
      await loadMessages(conversationId);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId) => {
    onSelectConversation?.(conversationId);
  };

  // Handle new conversation
  const handleNewConversation = async () => {
    try {
      setActionLoading('new');
      const res = await startNewConversation();
      setConversations(prev => [res.conversation, ...prev]);
      handleSelectConversation(res.conversation._id);
      onNewConversation?.();
    } catch (err) {
      console.error("❌ Error creating conversation:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      setActionLoading(conversationId);
      await deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c._id !== conversationId));
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[conversationId];
        return newMessages;
      });
      
      if (selectedConversationId === conversationId) {
        handleSelectConversation(null);
      }
    } catch (err) {
      console.error("❌ Error deleting conversation:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle summarize conversation
  const handleSummarizeConversation = async (conversationId, e) => {
    e.stopPropagation();
    
    try {
      setActionLoading(conversationId);
      const res = await summarizeConversation(conversationId);
      // Refresh messages to show summary
      setMessages(prev => ({
        ...prev,
        [conversationId]: [res.message]
      }));
      
      // Update conversation title to reflect summary
      setConversations(prev => prev.map(c => 
        c._id === conversationId 
          ? { ...c, title: "Summarized: " + c.title.slice(0, 30) }
          : c
      ));
    } catch (err) {
      console.error("❌ Error summarizing conversation:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
          <button
            onClick={handleNewConversation}
            disabled={actionLoading === 'new'}
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
          >
            {actionLoading === 'new' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>+</span>
            )}
            New Chat
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="mb-2">💬</div>
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <div key={conversation._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Conversation Header */}
                <div
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversationId === conversation._id ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.title || "Untitled Conversation"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </span>
                        {conversation.totalTokens > 0 && (
                          <span className="text-xs text-gray-400">
                            • {conversation.totalTokens} tokens
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleConversation(conversation._id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                        title="View messages"
                      >
                        {expandedConv === conversation._id ? '▼' : '▶'}
                      </button>
                      
                      <button
                        onClick={(e) => handleSummarizeConversation(conversation._id, e)}
                        disabled={actionLoading === conversation._id}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-yellow-600"
                        title="Summarize"
                      >
                        {actionLoading === conversation._id ? '⏳' : '📝'}
                      </button>
                      
                      <button
                        onClick={(e) => handleDeleteConversation(conversation._id, e)}
                        disabled={actionLoading === conversation._id}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Messages */}
                {expandedConv === conversation._id && messages[conversation._id] && (
                  <div className="border-t border-gray-100 bg-gray-50 p-3 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {messages[conversation._id].map((message, index) => (
                        <div key={index} className="flex gap-2 text-sm">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            message.sender === 'user' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {message.sender === 'user' ? 'U' : 'AI'}
                          </div>
                          <div className="flex-1">
                            <div className={`p-2 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-blue-50 text-blue-900 ml-auto max-w-[80%]' 
                                : 'bg-white text-gray-900 max-w-[80%] border border-gray-200'
                            }`}>
                              <p className="text-xs line-clamp-3">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
