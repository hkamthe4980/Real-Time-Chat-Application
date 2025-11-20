
"use client";
import React, { useEffect, useRef, useState } from "react";
import useStreamResponse from "../hooks/useStreamHook";
import TokenPanel from "./TokenPanel";
import ThinkingLoader from "./ThinkingLoader";
import TokenBudgetModal from "./TokenBudgetModal";
import { getConversationMessages } from "../utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiArrowDown } from 'react-icons/fi';



export default function ChatBox({ conversationId: propConversationId }) {
  const { data, tokenData, loading, isThinking, ttft, sendQuery, stopStream, budgetData, setBudgetData, errorMsg, isRetrying, retryCount } =
    useStreamResponse();
  console.log("----budget data in chatbox", budgetData);

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [conversationId, setConversationId] = useState(propConversationId);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [showTokenPanel, setShowTokenPanel] = useState(false);

  const assistantIdRef = useRef(null);
  const scrollRef = useRef(null);

  const inputRef = useRef(null);
  const [showDown, setShowDown] = useState(false);

  useEffect(() => {
    setConversationId(propConversationId);
  }, [propConversationId]);

  useEffect(() => {
    const loadConversationMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        setLoadingMessages(false);
        return;
      }

      setLoadingMessages(true);
      try {
        const response = await getConversationMessages(conversationId);
        const msgs = response.messages.map((m) => ({
          id: m._id,
          sender: m.sender,
          text: m.content,
        }));
        setMessages(msgs);
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadConversationMessages();
  }, [conversationId]);

  useEffect(() => {
    // inputRef.current.focus();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  // Show down arrow when not at bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowDown(scrollTop + clientHeight < scrollHeight - 40);
    };
    const ref = scrollRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, [scrollRef]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };


  useEffect(() => {
    if (!data) return;
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last.sender === "assistant" && last.id === assistantIdRef.current) {
        return [...prev.slice(0, -1), { ...last, text: data }];
      }
      return prev;
    });
  }, [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLastPrompt(prompt);

    const userMsg = { id: Date.now() + "_u", sender: "user", text: prompt };
    const assistantId = Date.now() + "_a";
    assistantIdRef.current = assistantId;

    const assistantPlaceholder = { id: assistantId, sender: "assistant", text: "" };

    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);

    sendQuery(prompt, conversationId);

    setPrompt("");
  };

  const handleBudgetAction = ({ action, conversation }) => {
    setBudgetData(null);

    if (action === "start_new") {
      setConversationId(conversation._id);
      sendQuery(lastPrompt, conversation._id);
    }

    if (action === "delete_conv") {
      setConversationId(null);
    }

    if (action === "summarize") {
      sendQuery(lastPrompt, conversationId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 ml-5">
            {conversationId ? "Chat" : "New Chat"}
          </h1>
          <button
            onClick={() => setShowTokenPanel((s) => !s)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Token Details
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-[100px]" ref={scrollRef}>
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : messages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p>Start a conversation...</p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {errorMsg && (
              <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-700 font-medium">Error</p>
                      <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
                      {isRetrying && (
                        <p className="text-orange-600 text-sm mt-2">
                          Retrying... (attempt {retryCount}/5)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`px-6 py-4 ${m.sender === 'user' ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'
                      }`}>
                      <span className="text-white text-sm font-medium">
                        {m.sender === 'user' ? 'U' : 'A'}
                      </span>
                    </div>
                    <div className="flex-1">
                      {m.sender === "assistant" ? (
                        m.text ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} >
                            {m.text}
                          </ReactMarkdown>
                        ) : (
                          isThinking && <ThinkingLoader />
                        )
                      ) : (
                        <p className="text-gray-800">{m.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* input div */}
        <div
          className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-20 
             px-3 sm:px-4 flex justify-center"
          style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}
        >
          <div
            className="
      w-full 
      max-w-3xl 
      py-3 
      flex 
      justify-center
    "
          >
            <form
              onSubmit={handleSubmit}
              className="
        flex 
        items-end 
        gap-2 sm:gap-3 
        w-full
      "
            >
              {/* Textarea */}
              <textarea
                autoFocus
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Message ChatGPT…"
                disabled={loading}
                rows={1}
                className="
          flex-1 
          px-4 py-3 
          rounded-xl 
          border border-gray-300
          bg-gray-50 
          text-gray-900 
          placeholder-gray-400
          resize-none 
          shadow-sm 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500
          min-w-0
        "
                style={{
                  minHeight: "48px",
                  maxHeight: "160px",
                  overflowY: "auto",
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="
          px-5 py-3 
          rounded-xl 
          bg-[#1f10a3] 
          text-white 
          font-medium 
          hover:bg-[#0E8C6C]
          disabled:bg-gray-300 
          disabled:cursor-not-allowed 
          transition-all 
          shadow-sm
        "
              >
                {loading ? "Sending..." : "Send"}
              </button>

              {/* Stop Button */}
              {(loading || isThinking) && (
                <button
                  type="button"
                  onClick={stopStream}
                  className="
            px-4 py-3 
            rounded-xl 
            bg-red-500 
            text-white 
            font-medium 
            hover:bg-red-600 
            transition-all 
            shadow-sm
          "
                >
                  Stop
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Down Arrow Button */}
        {showDown && (
          <button
            className="fixed right-6 bottom-28 sm:bottom-32 z-30 bg-white border border-gray-200 rounded-full shadow-lg p-2 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <FiArrowDown className="w-6 h-6 text-gray-700" />
          </button>
        )}

      </div>

      {/* Input Area */}



      {/* Popups */}
      {showTokenPanel && (
        <TokenPanel tokenData={tokenData} onClose={() => setShowTokenPanel(false)} />
      )}

      {budgetData && (
        <TokenBudgetModal
          eventData={budgetData}
          onClose={() => setBudgetData(null)}
          onAction={handleBudgetAction}
        />
      )}
    </div>
  );
}
