//* vaish
"use client";

import React, { useState, useEffect, useRef } from "react";
import { SiAudiobookshelf } from "react-icons/si";
import { MdDownloading } from "react-icons/md";

const ChatMain = ({ messages, userId, typingUsers = [] }) => {
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    // ⭐ FULLSCREEN IMAGE PREVIEW MODAL STATE
    const [previewImage, setPreviewImage] = useState(null);

    const closePreview = () => setPreviewImage(null);

    // Auto-scroll on new messages
    useEffect(() => {
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 50);
    }, [messages, typingUsers]);

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

    // -------------------------------
    // ⭐ RENDER FILE MESSAGE
    // -------------------------------

    const renderFileMessage = (message, type, avatarUrl) => {
        const fileUrl = `http://localhost:5001${message.fileUrl}`;
        return (
            <div
                key={message.id}
                className={`flex ${type === "sent" ? "justify-end" : "items-start space-x-2"
                    } mb-3`}
            >
                {/* Avatar for received messages */}
                {type === "received" && (
                    <img
                        src={avatarUrl}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full"
                    />
                )}

                {/* File bubble */}
                <div className="max-w-[75%]">
                    <div
                        className={`relative rounded-2xl px-2 pr-2 pb-2 pt-2 shadow-sm border ${type === "received"
                            ? "bg-white border-gray-300 rounded-bl-sm"
                            : "bg-black text-white border-black rounded-br-sm"
                            }`}
                    >
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
                            className={`text-sm underline ${type === "sent" ? "text-blue-300" : "text-blue-600"
                                }`}
                        >
                            Download
                        </a>

                        {/* ⭐ Timestamp inside bubble (no overlap) */}
                        <span
                            className={`absolute bottom-1 right-2 text-[9px] ${type === "sent" ? "text-gray-300" : "text-gray-500"
                                } px-1`}
                        >
                            {message.timestamp}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------------
    // ⭐ RENDER TEXT MESSAGE
    // -------------------------------
    const renderTextMessage = (message, type, avatarUrl) => {
        const senderName = getSenderName(message.sender);

        return type === "received" ? (
            <div key={message.id} className="flex items-start space-x-2 mb-3">
                {/* Avatar */}
                <img
                    src={avatarUrl}
                    alt={senderName}
                    className="w-8 h-8 rounded-full"
                />

                {/* Message bubble & timestamp */}
                <div className="max-w-[75%]">
                    <div className="bg-white text-black rounded-2xl rounded-bl-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative">
                        <p className="text-[15px] leading-snug">{message.content}</p>

                        <span className="text-[9px] text-gray-400 absolute bottom-1 right-2 px-2">
                            {message.timestamp}
                        </span>
                    </div>
                </div>
            </div>
        ) : (
            <div key={message.id} className="flex justify-end mb-3">
                {/* Message bubble & timestamp */}
                <div className="max-w-[75%]">
                    <div className="bg-black text-white rounded-2xl rounded-br-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative">
                        <p className="text-[15px] leading-snug">{message.content}</p>

                        <span className="text-[9px] text-gray-300 absolute bottom-1 right-2 px-1">
                            {message.timestamp}
                        </span>
                    </div>
                </div>
            </div>
        );
    };


    // -------------------------------
    // ⭐ RENDER AUDIO MESSAGE 
    // ------------------------------
    const renderAudioMessage = (message, type, avatarUrl) => {
        const audioUrl = `http://localhost:5001${message.fileUrl}`;
        const isSent = type === "sent";

        return (
            <div
                key={message.id}
                className={`flex ${isSent ? "justify-end" : "items-start space-x-2"
                    } mb-3`}
            >
                {/* Avatar for received */}
                {!isSent && (
                    <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                )}

                {/* Bubble */}
                <div className="max-w-[75%]">
                    <div
                        className={`relative rounded-2xl px-2 pr-2 pb-2 pt-2 shadow-sm border flex items-center space-x-2 ${isSent
                            ? "bg-black text-white border-black rounded-br-sm"
                            : "bg-white text-black border-gray-300 rounded-bl-sm"
                            }`}
                    >
                        {/* Play button */}
                        <button
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                            onClick={(e) => {
                                const audio = e.currentTarget.parentNode.querySelector("audio");
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
                            style={{
                                filter: isSent ? "invert(1)" : "none",
                            }}
                        />

                        {/* Download button */}
                        <a
                            href={audioUrl}
                            download={message.fileName}
                            className="text-sm underline"
                        >
                            <MdDownloading className={`${isSent ? "text-white" : "text-black"} h-5 w-5`} />
                        </a>

                        {/* ⭐ Timestamp inside bubble  */}
                        <span
                            className={`absolute bottom-1 right-2 text-[9px] pt-2 ${isSent ? "text-gray-300" : "text-gray-500"
                                } px-1`}
                        >
                            {message.timestamp}
                        </span>
                    </div>
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
        <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto px-4 sm:px-6 pt-0 pb-4 bg-gray-50 scrollbar-hide"
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
    );
};

export default ChatMain;
