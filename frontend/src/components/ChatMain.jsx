// 'use client';
import React, { useEffect, useRef } from 'react';

const ChatMain = ({ messages, conversation }) => {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [messages]);
  const renderMessage = (message) => {
    switch (message.type) {
      case 'system':
        return (
          <div key={message.id} className="flex justify-center my-4 mt-4">
            <div className="bg-gray-200 text-black rounded-lg px-3 py-2 text-base border border-gray-300 shadow-sm flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{message.content}</span>
            </div>
          </div>
        );

      case 'received':
        return (
          <div key={message.id} className="flex items-start space-x-3 mb-4">
            <img
              src='https://ui-avatars.com/api/?name=Pushk&background=52D137&color=FFFFFF&size=32'
              alt={conversation?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[28rem] shadow-sm">
                <p className="text-black text-base leading-relaxed">{message.content}</p>
                {message.reactions && (
                  <div className="flex space-x-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="bg-gray-100 rounded-full px-2.5 py-1 text-sm flex items-center gap-1.5 cursor-pointer transition-colors border border-gray-300 hover:bg-gray-200 text-gray-800"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500 mt-1 block">{message.timestamp}</span>
            </div>
          </div>
        );

      case 'sent':
        return (
          <div key={message.id} className="flex justify-end mb-4">
            <div className="flex flex-col items-end max-w-md">
              <div className="bg-black text-white rounded-xl px-4 py-3 max-w-[28rem] shadow-md">
                <p className="text-base leading-relaxed">{message.content}</p>
                {message.attachments && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg px-3 py-3 mt-2 border border-gray-300">
                        {attachment.type === 'video' && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-base font-medium text-black">{attachment.title}</p>
                              <p className="text-sm text-gray-600">{attachment.duration}</p>
                            </div>
                          </div>
                        )}
                        {attachment.type === 'report' && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-base font-medium text-black">{attachment.title}</h4>
                                <p className="text-sm text-gray-600">{attachment.date}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {attachment.metrics.map((metric, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{metric.label}</span>
                                  <span className="font-medium">{metric.value}</span>
                                </div>
                              ))}
                            </div>
                            <button className="mt-2 text-sm text-gray-700 hover:text-black underline font-medium">
                              View Full Report
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {message.description && (
                  <p className="text-sm text-gray-300 mt-2">{message.description}</p>
                )}
              </div>
              <span className="text-sm text-gray-500 mt-1">{message.timestamp}</span>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div key={message.id} className="flex items-start space-x-3 mb-4">
            <img
              src='https://ui-avatars.com/api/?name=User&background=6B7280&color=FFFFFF&size=32'
              alt={conversation?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[28rem] shadow-sm">
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <p className="text-base text-gray-800">{message.content}</p>
                    <span className="text-sm text-gray-600">{message.duration}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500 mt-1 block">{message.timestamp}</span>
            </div>
          </div>
        );

      case 'typing':
        return (
          <div key={message.id} className="hidden md:flex items-start space-x-3 mb-20">
            <img
              src={conversation?.avatar || 'https://ui-avatars.com/api/?name=User&background=6B7280&color=FFFFFF&size=32'}
              alt={conversation?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-[28rem] shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '-0.32s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '-0.16s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" style={{ animation: 'bounce 1.4s infinite ease-in-out' }}></div>
                  <span className="text-base text-gray-600 ml-2">{message.content}</span>
                </div>
              </div>
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
      className="h-full overflow-y-auto px-4 sm:px-6 pt-0 pb-4 sm:pb-6 bg-gray-50 scrollbar-hide"
    >
      <div className="max-w-4xl mx-auto">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMain;