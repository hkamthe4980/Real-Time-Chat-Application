
//* vaish
"use client";

import React, { useState, useEffect, useRef } from "react";
import { SiAudiobookshelf } from "react-icons/si";
import { MdDownloading } from "react-icons/md";
import { deleteGroupMessage, editGroupMessage } from "../utils/api";
import { HiDotsVertical } from "react-icons/hi";

const ChatMain = ({ messages, userId, typingUsers = [] }) => {
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [messageToDelete, setMessageToDelete] = useState(null);

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
    // ⭐ CONTEXT MENU STATE
    // This state controls our message options menu
    // visible → should the menu show?
    // x, y → where the menu appears on screen
    // messageId → which message the menu belongs to
    const [menuState, setMenuState] = useState({
        visible: false,
        x: 0,
        y: 0,
        messageId: null
    });

    // we store longPressTimer so we can cancel it later
    const longPressTimer = useRef(null);

    // When user clicks anywhere on the page → close menu
    useEffect(() => {
        function closeMenu() {
            setMenuState({
                visible: false,
                x: 0,
                y: 0,
                messageId: null
            });
        }

        // Add a click listener to the whole window
        window.addEventListener("click", closeMenu);

        // Clean up the listener when component is removed
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    // ⭐ Long Press Handlers
    const handleTouchStart = (e, message) => {
        // Only allow actions for own messages
        if (getSenderId(message.sender) !== userId) return;

        // Get where the user's finger touched
        const touchPoint = e.touches[0];

        // Start a timer — if the user keeps touching for 300ms, show the menu
        longPressTimer.current = setTimeout(() => {
            setMenuState({
                // show the menu
                visible: true,
                // where to show it:
                // place menu at finger X
                x: touchPoint.clientX,
                // place menu at finger Y
                y: touchPoint.clientY,
                // attach menu to this message
                messageId: message._id || message.id
            });
        }, 300); // 300ms threshold
    };

    // This runs when the user lifts their finger
    const handleTouchEnd = () => {
        // If the user didn’t hold long enough, cancel the timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    // ⭐ Handle Actions
    const handleEdit = async (message) => {
        // Ask user for new message text
        const newText = prompt("Edit message:", message.content || message.text);

        if (newText && newText !== message.content) {
            try {
                // message.id is typically 'messgaeId' mapped in page.jsx, but backend needs true _id
                // Our mapMessage puts _id into id.
                await editGroupMessage(message.id, newText);
                console.log("Message edited");
            } catch (err) {
                console.error("Edit failed", err);
                alert("Failed to edit message");

            }
        }
    };

    const handleDelete = async (messageId) => {
        // console.log("Deleting msg ID:", messageId);
        if (confirm("Delete this message?")) {
            try {
                await deleteGroupMessage(messageId);
                console.log("Message deleted");
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete message");
            }
        }
    };


    const renderTextMessage = (message, type, avatarUrl) => {
        const senderName = getSenderName(message.sender);
        const isSent = type === "sent";

        // Logic for Context Menu visibility on this specific message
        const showMenu = menuState.visible && (menuState.messageId === (message._id || message.id));

        return type === "received" ? (
            <div key={message.id} className="flex items-start space-x-2 mb-3">
                {/* Avatar */}
                <img
                    src={avatarUrl}
                    alt={senderName}
                    className="w-8 h-8 rounded-full"
                />

                {/* Message bubble & timestamp */}
                <div className="max-w-[75%] relative">
                    <div className="bg-white text-black rounded-2xl rounded-bl-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative">
                        <p className="text-[15px] leading-snug">{message.content}</p>


                        <span className="text-[9px] text-gray-400 absolute bottom-1 right-2 px-2">
                            {message.timestamp}
                        </span>
                    </div>
                </div>
            </div>
        ) : (
            <div key={message.id} className="flex justify-end mb-3 relative">
                <div className="flex items-end group">

                    {/* Message bubble & timestamp */}
                    <div
                        className="max-w-[75%] relative select-none"
                        onTouchStart={(e) => handleTouchStart(e, message)}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={(e) => {
                            // Also support desktop long press or right click simulation
                            if (getSenderId(message.sender) !== userId) return;
                            longPressTimer.current = setTimeout(() => {
                                setContextMenu({
                                    visible: true,
                                    x: e.clientX,
                                    y: e.clientY,
                                    messageId: message._id || message.id
                                });
                            }, 500);
                        }}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                    >
                        <div className="bg-black text-white rounded-2xl rounded-br-sm px-3 pr-10 pb-4 pt-2 shadow-sm relative cursor-pointer active:opacity-80 transition-opacity">
                            <p className="text-[15px] leading-snug">{message.content}</p>

                            <span className="text-[9px] text-gray-300 absolute bottom-1 right-2 px-1">
                                {message.timestamp}
                            </span>
                        </div>

                        {/* ⭐ Context Menu Overlay */}
                        {showMenu && (
                            <div
                                className="absolute top-10 right-0 bg-white shadow-xl border border-gray-200 rounded-lg p-1 z-50 w-32 flex flex-col"
                                style={{ animation: "fadeIn 0.2s ease-out" }}
                            >
                                <button
                                    className="text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-800 rounded-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(message);
                                        setMenuState({ visible: false, x: 0, y: 0, messageId: null });
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-600 rounded-md"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(message._id || message.id);
                                        setMenuState({ visible: false, x: 0, y: 0, messageId: null });
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}

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
        // console.log("mesage", message)
        const senderId = getSenderId(message.sender);
        const senderName = getSenderName(message.sender);
        const senderAvatar = getSenderAvatar(message.sender);

        // ⭐ Determine sent/received
        const type = senderId === userId ? "sent" : "received";

        // ⭐ Create dynamic avatar (Unified logic for all message types)
        // console.log("senderAvatar:", senderAvatar);
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

    // -------------------------------
    // ⭐ RENDER CHAT
    // ------------------------------
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
