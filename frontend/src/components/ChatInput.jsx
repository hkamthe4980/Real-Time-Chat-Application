//* vaish
"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { searchGroupMembers } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import { AiOutlinePaperClip } from "react-icons/ai";
import { FaMicrophone } from "react-icons/fa";

const ChatInput = ({ onSendMessage, onMessageSuccess, groupId, senderId, userName, userAvatar }) => {
  // console.log("ChatInput Props - userAvatar:", userAvatar);
  const [text, setText] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const [results, setResults] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef(null);
  //? Typing Debounce Refs:
  // Tracks the active timer ID so we can cancel it
  const typingTimeoutRef = useRef(null);
  // Tracks if we have already sent "true" to the backend, so we don't send it 100 times
  const isTypingRef = useRef(false);

  const fileRef = useRef(null); // ⭐ ADDED
  const imageRef = useRef(null);
  const docRef = useRef(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);   // file waiting to send
  const [previewUrl, setPreviewUrl] = useState(null);     // image preview

  /* ---------------------------------------------------
       ⭐ AUDIO / MIC STATE (NEW)
    --------------------------------------------------- */
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAudio, setPendingAudio] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ⭐ Browser Speech-to-Text
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const recognitionRef = useRef(null);
  const [liveText, setLiveText] = useState("");

  useEffect(() => {
    console.log("Live text:", liveText);
  }, [liveText]);


  // ⭐ Autofocus on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  //? SSE typing event
  // ⭐ Send typing event ONCE when input gains focus OR loses focus
  const sendTypingStatus = async (isTyping) => {
    try {
      let realSenderId = senderId;

      if (!realSenderId && typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) realSenderId = jwtDecode(token).id;
      }

      console.log("SENDING TYPING:", { isTyping, userAvatar });
      await fetch("http://localhost:5001/api/messages/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          senderId: realSenderId,
          userName,
          userAvatar,
          typing: isTyping,
        }),
      });
    } catch (err) {
      console.log("Typing error:", err);
    }
  };

  // ⭐ When user clicks input → DO NOTHING (Wait for actual typing)
  const handleFocus = () => {
    // sendTypingStatus(true); // 👈 REMOVED
  };

  // ⭐ When user clicks away → stop typing immediately
  const handleBlur = () => {
    // If we were marked as typing, stop it immediately.
    if (isTypingRef.current) {
      sendTypingStatus(false);
      isTypingRef.current = false;

      // Cancel the pending 2-second timer since we handled it manually here
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  // ⭐ Handle text + mentions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setText(value);

    // ⭐ TYPING INDICATOR LOGIC (DEBOUNCED)
    // 1. If not already typing, send "true"
    // If we haven't told the server we are typing yet, do it now.
    if (!isTypingRef.current) {
      sendTypingStatus(true);
      isTypingRef.current = true;
    }

    // 2. Clear existing timeout (reset the timer)
    // If there was a timer counting down to "stop typing", cancel it.
    // We are still typing, so we need more time!
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 3. Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      isTypingRef.current = false;
    }, 2000);

    const lastAt = value.lastIndexOf("@");

    if (lastAt === -1) {
      setShowDropdown(false);
      return;
    }

    const query = value.slice(lastAt + 1).trim();

    if (!query) {
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

    const updated = before + "@" + user.name + " ";
    setText(updated);

    if (!mentions.includes(user._id)) {
      setMentions((prev) => [...prev, user._id]);
    }

    setShowDropdown(false);

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    onSendMessage(trimmed, {
      text: trimmed,
      mentions,
      isUrgent,
    });

    setText("");
    setIsUrgent(false);
    setMentions([]);
    setShowDropdown(false);

    // After sending message → hide typing
    // After sending message → hide typing
    if (isTypingRef.current) {
      sendTypingStatus(false);
      isTypingRef.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    // And focus again
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ⭐ Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store file in state but DO NOT upload yet
    setPendingFile(file);

    // If file is image → generate preview
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null); // no preview for documents
    }
  };

  // ⭐ Upload file
  const uploadPendingFile = async () => {
    if (!pendingFile) return;

    const formData = new FormData();
    formData.append("file", pendingFile);
    formData.append("groupId", groupId);
    formData.append("senderId", senderId);
    formData.append("name", userName);
    formData.append("avatar", userAvatar); // ⭐ ADDED

    // Get token
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5001/api/messages/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("Upload failed:", await response.text());
      return;
    }

    const data = await response.json();
    if (onMessageSuccess) {
      onMessageSuccess(data);
    }

    // Reset preview
    setPendingFile(null);
    setPreviewUrl(null);
  };

  // ⭐ Handle audio upload
  const handleAudioUpload = (e) => {
    const audio = e.target.files[0];
    if (!audio) return;

    // Store audio in state but DO NOT upload yet
    setPendingAudio(audio);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAudioPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(audio);
  };

  // ⭐ Upload audio
  const uploadPendingAudio = async () => {
    if (!pendingAudio) return;

    const formData = new FormData();
    formData.append("audio", pendingAudio);
    formData.append("groupId", groupId);
    formData.append("senderId", senderId);
    formData.append("name", userName);
    formData.append("avatar", userAvatar); // ⭐ ADDED

    // Get token
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5001/api/messages/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("Upload failed:", await response.text());
      return;
    }

    // Reset preview
    setPendingAudio(null);
    setAudioPreviewUrl(null);
  };

  /* ---------------------------------------------------
     ⭐ AUDIO: START / STOP RECORDING (NEW)
  --------------------------------------------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setPendingAudio(blob);
        const url = URL.createObjectURL(blob);
        setAudioPreviewUrl(url);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      // ⭐ START BROWSER SPEECH RECOGNITION
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-IN";

        recog.onresult = (e) => {
          console.log("Speech detected:", e.results);
          const transcript = Array.from(e.results)
            .map((r) => r[0].transcript)
            .join("");

          console.log("Live transcript:", transcript);
          setLiveText(transcript);
        };

        recog.onerror = (e) => console.log("Speech error:", e.error);
        recog.start();
        recognitionRef.current = recog;
      }

      setIsRecording(true);
    } catch (err) {
      console.log("Mic permission / recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    // ⭐ STOP SPEECH RECOGNITION
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  /* ---------------------------------------------------
     ⭐ AUDIO: SEND VOICE NOTE (NEW)
  --------------------------------------------------- */
  const sendAudio = async () => {
    if (!pendingAudio) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", pendingAudio, "voice-note.webm");
    formData.append("groupId", groupId);
    formData.append("senderId", senderId);
    formData.append("name", userName);
    formData.append("avatar", userAvatar); // ⭐ ADDED
    formData.append("type", "audio"); // 👈 important for backend
    formData.append("transcription", liveText); // ⭐ audio transcription

    const res = await fetch("http://localhost:5001/api/messages/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      console.error("Audio upload failed:", await res.text());
      return;
    }

    const data = await res.json();
    if (onMessageSuccess) {
      onMessageSuccess(data);
    }

    // reset audio preview
    setPendingAudio(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl(null);
    }
  };

  const cancelAudio = () => {
    setPendingAudio(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl(null);
    }
  };

  // console.log("results--------", results);


  return (
    <div className="relative bg-white border-t border-gray-200 px-4 pt-3 pb-[6px] shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">

      {/* ⭐ FLOATING WHATSAPP-STYLE FILE PREVIEW (EXISTING) */}
      {pendingFile && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl border z-50 w-[260px]">
          {/* Close preview */}
          <button
            onClick={() => {
              setPendingFile(null);
              setPreviewUrl(null);
            }}
            className="absolute top-1 right-1 text-gray-600 hover:text-black text-lg cursor-pointer"
          >
            ✕
          </button>

          {previewUrl ? (
            <img
              src={previewUrl}
              className="w-full h-48 object-cover rounded-lg mb-3"
              alt="preview"
            />
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg text-center mb-3">
              <p className="font-semibold text-gray-700">{pendingFile.name}</p>
            </div>
          )}

          <button
            onClick={uploadPendingFile}
            className="w-full bg-black text-white py-2 rounded-lg active:scale-95 transition"
          >
            Send
          </button>
        </div>
      )}

      {/* ⭐ FLOATING AUDIO PREVIEW (NEW) */}
      {pendingAudio && (
        <div className="absolute bottom-24 right-4 bg-white p-4 rounded-xl shadow-xl border z-40 w-[260px] flex flex-col gap-2">
          <audio controls src={audioPreviewUrl} className="w-full" />
          <div className="flex justify-between gap-2 mt-1">
            <button
              onClick={cancelAudio}
              className="flex-1 border border-gray-300 rounded-lg py-1 text-sm dark:text-black"
            >
              Cancel
            </button>
            <button
              onClick={sendAudio}
              className="flex-1 bg-black text-white rounded-lg py-1 text-sm active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Hidden Inputs for images/docs */}
      <input
        type="file"
        accept="image/*"
        ref={imageRef}
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
        ref={docRef}
        className="hidden"
        onChange={handleFileUpload}
      />

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-end space-x-2">

          {/* Attachment Button + Menu */}
          <div className="relative pb-1">
            <button
              type="button"
              onClick={() => setShowAttachMenu((prev) => !prev)}
              className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition active:scale-95 shadow-md "
            >
              <AiOutlinePaperClip className="text-white text-xl" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-14 left-0 bg-white border border-gray-300 rounded-xl shadow-xl py-2 w-40 z-50 dark:text-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    imageRef.current?.click();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  🖼️ Images
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    docRef.current?.click();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  📄 Document
                </button>
              </div>
            )}
          </div>

          {/* Old hidden generic fileRef (kept in case you use it later) */}
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={handleFileUpload}
          />


          {/* Input Box */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Type a message..."
              className="w-full bg-gray-100 border border-gray-300 rounded-3xl px-5 py-3 pr-12 text-[15px] leading-snug resize-none focus:outline-none focus:ring-2 focus:ring-black min-h-[48px] max-h-[120px] dark:text-gray-700 scrollbar-hide"
              rows="1"
            />

            {/* Mentions Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute left-0 bottom-[52px] z-50 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {results.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectMention(user)}
                    className="px-4 cursor-pointer hover:bg-gray-100 text-base dark:text-black flex gap-4 overflow-hidden"
                  >
                    {/* Avatar */}
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=52D137&color=FFFFFF`}
                      alt="user avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover self-center my-3"
                    />
                    <div className="flex-1 border-b border-gray-200 flex items-center">
                      <span className="text-black font-medium">{user.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ⭐ MIC BUTTON (INSIDE INPUT) */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute right-2 bottom-3 w-9 h-9 flex items-center justify-center rounded-full transition active:scale-95 ${isRecording ? "text-red-500 bg-red-100" : "text-gray-500 hover:text-black hover:bg-gray-200"
                }`}
            >
              <FaMicrophone className="text-lg" />
            </button>
          </div>
          {/* ⭐ MIC BUTTON (NEW) */}
          {/* <button
            type="button"
            onClick={toggleRecording}
            className={`min-w-11 min-h-11 rounded-full flex items-center justify-center shadow-md transition active:scale-95 ${isRecording ? "bg-red-500" : "bg-black"
              } text-white`}
          >
            <FaMicrophone className="text-xl" />
          </button> */}


          {/* Send Button (same line) */}
          <button
            type="submit"
            className="min-w-12 min-h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition active:scale-95 shadow-md mb-1"
          >
            <IoMdSend className="text-white text-xl ml-1" />
          </button>

        </div>
      </form >
    </div >


  );
};

export default ChatInput;