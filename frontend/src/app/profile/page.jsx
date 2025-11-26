"use client";
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatProfile from '@/components/ChatProfile';
import '@/styles/mobile-chat.css';
import { HiUserGroup } from "react-icons/hi2";

const Profile = ({conversation}) => {
    const router = useRouter();
//   if (!conversation) return null;

    const [selectedConversation, setSelectedConversation] = useState('arjun-patil');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'system',
            content: 'Session scheduled for today 4:00 PM - Hockey Practice',
            timestamp: '10:25 AM'
        },
        {
            id: 2,
            type: 'received',
            content: 'Coach, I\'ve been struggling with my shot accuracy during practice. Could you help me improve?',
            timestamp: '10:30 AM',
            reactions: [{ emoji: '👍', count: 1 }]
        },
        {
            id: 3,
            type: 'sent',
            content: 'Absolutely! I\'ve prepared a training drill video for you. Let\'s work on your stick positioning and follow-through.',
            timestamp: '10:32 AM',
            attachments: [
                {
                    type: 'video',
                    title: 'Hockey Shot Tutorial',
                    duration: '3:24',
                    thumbnail: '/api/placeholder/200/120'
                }
            ],
            description: 'Hockey Shooting Fundamentals - Focus on stick positioning and follow-through'
        },
        {
            id: 4,
            type: 'voice',
            content: 'Voice message',
            duration: '1:23',
            timestamp: '10:35 AM'
        },
        {
            id: 5,
            type: 'sent',
            content: 'Here\'s your performance analysis from yesterday\'s practice:',
            timestamp: '10:40 AM',
            attachments: [
                {
                    type: 'report',
                    title: 'Performance Report',
                    date: 'Jan 15, 2024',
                    metrics: [
                        { label: 'Shot Accuracy:', value: '78%' },
                        { label: 'Defensive Rating:', value: '92.1' },
                        { label: 'Overall Score:', value: '8.5/10' }
                    ]
                }
            ]
        },
        {
            id: 6,
            type: 'received',
            content: 'Wow! Thank you so much coach! This is exactly what I needed. I\'ll practice these drills before our next session. 🏑',
            timestamp: '10:42 AM',
            reactions: [
                { emoji: '❤️', count: 1 },
                { emoji: '🔥', count: 1 }
            ]
        },
        {
            id: 7,
            type: 'typing',
            content: 'Arjun is typing...',
            timestamp: 'now'
        }
    ]);
    
    const [conversations] = useState([
        {
            id: 'arjun-patil',
            name: 'Waybeyond Mafia',
            avatar: 'https://ui-avatars.com/api/?name=Waybeyond+mafia&background=6B7280&color=FFFFFF&size=32',
            lastMessage: 'Coach, I need help with my shot accuracy...',
            timestamp: '2m',
            unreadCount: 2,
            isUrgent: true,
            isOnline: true,
            isGroup: true,
            memberCount: 21
        },
        {
            id: 'hockey-team-a',
            name: 'Hockey Team A',
            avatar: 'https://ui-avatars.com/api/?name=Hockry+Team&background=6B7280&color=FFFFFF&size=32',
            lastMessage: 'Sneha: Thanks for the training plan coach!',
            timestamp: '1h',
            unreadCount: 1,
            isGroup: true,
            memberCount: 12
        },
        {
            id: 'sneha-joshi',
            name: 'Pickle ball',
            avatar: 'https://ui-avatars.com/api/?name=Pickle+Ball&background=6B7280&color=FFFFFF&size=32',
            lastMessage: 'Voice message',
            timestamp: '3h',
            hasVoiceMessage: true,
            voiceDuration: '0:45'
        },
        {
            id: 'vikram-singh',
            name: 'Vikram Singh',
            avatar: 'https://ui-avatars.com/api/?name=Vikram+S&background=6B7280&color=FFFFFF&size=32',
            lastMessage: 'Perfect! See you at practice tomorrow',
            timestamp: '1d',
            lastSeen: 'Last seen 8h ago'
        },
        {
            id: 'priya-sharma',
            name: 'Priya Sharma',
            avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=6B7280&color=FFFFFF&size=32',
            lastMessage: 'Thank you for the feedback on my performance',
            timestamp: '2d'
        }
    ]);
    
    const [quickReplies] = useState([
        'Great work! 👏',
        'Keep it up!',
        'See you at training'
    ]);

    const handleSendMessage = (message) => {
        const newMessage = {
            id: messages.length + 1,
            type: 'sent',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
    };

    const handleQuickReply = (reply) => {
        handleSendMessage(reply);
    };
    
    const selectedConv = conversations.find(conv => conv.id === selectedConversation);

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
            <ChatProfile
                className="w-full"
                conversation={selectedConv}
            />
        </div>
    );
};

export default Profile;