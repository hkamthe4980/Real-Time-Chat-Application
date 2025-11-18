
"use client";
import { useEffect, useState } from "react";
import useStreamResponse from "../hooks/useStreamHook.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatHistory from "../components/ChatHistory.jsx";
import TokenData from "../components/TokenData.jsx"

export default function ChatBox() {
  const [prompt, setPrompt] = useState("");
  const { tokenData, data, loading, sendQuery, ttft ,errorMsg} = useStreamResponse();
  // const [selectedConversation, setSelectedConversation] = useState(null);
  // console.log("Token chatBox Data", tokenData)
 
  
  const handleSubmit = (e) => {
   
    e.preventDefault();
    // if (!prompt.trim()) return;
    sendQuery(prompt);
    setPrompt("");
    
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-r from-indigo-50 via-white to-indigo-100">
      <div className="w-full lg:w-1/4 border-r mx-10 bg-white shadow-sm m-8 ml-9 mr-9">
        <ChatHistory />
      </div>
      <div className="w-full lg:w-2/4 bg-white shadow-lg rounded-2xl p-6 space-y-6 m-6" >
        <h1 className="text-2xl font-bold text-center text-indigo-700">
          Real-Time Chat
        </h1>

        {/* Chat output */}
        <div className="border rounded-xl p-4 h-80 overflow-y-auto bg-gray-50">
          {!data && !loading ? (
            <p className="text-gray-400 text-center mt-10">
              Ask something to start...
            </p>
          ) : (
            <div className="prose text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data}</ReactMarkdown>
              {loading && <span className="text-indigo-500">|</span>}
            </div>
          )}
        </div>

        {/* TTFT info */}
        {ttft && (
          <p className="text-sm text-center text-gray-500">
            ⚡ First token in <b>{ttft} ms</b>
          </p>
        )}
        {
          errorMsg && (
            <p className="text-sm text-center text-gray-500">
            Validation Error In Prompt <b>{errorMsg}</b>
          </p>
          )
        }

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question..."
            className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
      <div className="w-full lg:w-1/4 border-l bg-white shadow-sm p-4 ml-9 mr-9">
        <TokenData tokenData={tokenData} />
      </div>

    </div>

  );
}
