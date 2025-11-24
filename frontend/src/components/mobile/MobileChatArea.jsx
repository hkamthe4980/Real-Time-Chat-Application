'use client';
import React, { useState, useEffect, useRef } from 'react';

const MobileChatArea = ({ conversation, messages, onSendMessage, onBack, onProfileClick }) => {
  const [message, setMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const attachmentMenuRef = useRef(null);
  const inputAreaRef = useRef(null);

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAttachmentMenu &&
        attachmentMenuRef.current &&
        inputAreaRef.current &&
        !attachmentMenuRef.current.contains(event.target) &&
        !inputAreaRef.current.contains(event.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachmentMenu]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setShowAttachmentMenu(false);
    }
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'system':
        return (
          <div key={message.id} className="flex justify-center my-3">
            <div className="bg-[#FCD34D] text-[#0056b3] rounded-lg px-3 py-1.5 text-xs font-medium">
              {message.content}
            </div>
          </div>
        );

      case 'received':
        return (
          <div key={message.id} className="flex items-start space-x-2 mb-3">
            <img
              src={conversation?.avatar || 'https://ui-avatars.com/api/?name=User&background=6B7280&color=FFFFFF&size=32'}
              alt={conversation?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 max-w-[75%]">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <p className="text-sm text-gray-900">{message.content}</p>
                {message.reactions && (
                  <div className="flex space-x-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="bg-gray-100 rounded-full px-2 py-0.5 text-xs flex items-center space-x-1"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
            </div>
          </div>
        );

      case 'sent':
        return (
          <div key={message.id} className="flex justify-end mb-3">
            <div className="max-w-[75%]">
              <div className="bg-[#0056b3] text-white rounded-lg px-3 py-2">
                <p className="text-sm">{message.content}</p>
                {message.attachments && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="bg-blue-700 rounded-lg p-2">
                        {attachment.type === 'video' && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium">{attachment.title}</p>
                              <p className="text-xs text-blue-200">{attachment.duration}</p>
                            </div>
                          </div>
                        )}
                        {attachment.type === 'report' && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium">{attachment.title}</h4>
                                <p className="text-xs text-blue-200">{attachment.date}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {attachment.metrics.map((metric, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span>{metric.label}</span>
                                  <span className="font-medium">{metric.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {message.description && (
                  <p className="text-xs text-blue-100 mt-2">{message.description}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 block text-right">{message.timestamp}</span>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div key={message.id} className="flex items-start space-x-2 mb-3">
            <img
              src={conversation?.avatar || 'https://ui-avatars.com/api/?name=User&background=6B7280&color=FFFFFF&size=32'}
              alt={conversation?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 bg-[#0056b3] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div>
                    <p className="text-xs text-gray-600">{message.content}</p>
                    <span className="text-xs text-gray-500">{message.duration}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
            </div>
          </div>
        );

      case 'typing':
        return (
          <div key={message.id} className="flex items-start space-x-2 mb-3">
            <img
              src={conversation?.avatar || 'https://ui-avatars.com/api/?name=User&background=6B7280&color=FFFFFF&size=32'}
              alt={conversation?.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200 inline-block">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!conversation) return null;

  return (
    <div className="mobile-chat-area h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#0056b3] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="p-1 hover:bg-blue-600 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <button
            onClick={onProfileClick}
            className="flex-1 min-w-0 text-left"
          >
            <h2 className="text-base font-semibold truncate">{conversation.name}</h2>
            <div className="flex items-center space-x-1 text-xs text-blue-100">
              {conversation.isGroup && (
                <span>{conversation.memberCount} members</span>
              )}
            </div>
          </button>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button className="p-2 hover:bg-blue-600 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button
            onClick={onProfileClick}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map(renderMessage)}
      </div>

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div ref={attachmentMenuRef} className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle document action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Document</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle camera action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Camera</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle gallery action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Gallery</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle audio action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Audio</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle payment action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Payment</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle location action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Location</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle contact action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Contact</span>
            </button>
            
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Handle poll action
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-700 font-medium">Poll</span>
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div ref={inputAreaRef} className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
              }}
              placeholder="Type a message"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] resize-none text-sm min-h-[40px] max-h-[100px]"
              rows="1"
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-[#0056b3] text-white rounded-full hover:bg-[#004494] transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileChatArea;

