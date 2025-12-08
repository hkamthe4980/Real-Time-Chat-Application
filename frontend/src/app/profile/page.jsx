"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatProfile from '@/components/ChatProfile';
//? import API call method
import { getGroupDetails } from '@/utils/api';
// import '@/styles/mobile-chat.css';

const Profile = ({ }) => {
    //? get groupId from query
    const searchParams = useSearchParams();
    const groupId = searchParams.get('groupId');
    console.log("groupId form query: ", groupId);
    // console.log("groupId in profile", groupId);

    const [groupData, setGroupData] = useState(null);
    // if (!groupData) return null;

    // already present in chatMsg page but added here for profile page coz no context api
    //? user online status
    const [onlineUsers, setOnlineUsers] = useState([]);
    // -------------------------------------------------------
    //? SSE Listener for user online-ofline status
    // -------------------------------------------------------
    useEffect(() => {
        if (!groupId) return;

        //? change SSE back, so it expects token data to perform authentication 
        //? grab token from localStorage
        const token = localStorage.getItem("token");

        const es = new EventSource(
            //? add token to the URL
            `http://localhost:5001/api/sse/stream/${groupId}?token=${token}`
        );

        console.log("connection established for profile page")
        // ----------------------------------------------------
        // ⭐ NAMED EVENTS LISTENERS
        // ----------------------------------------------------
        // 1. Initial Presence State
        //? Gets list of all users already online in this group
        es.addEventListener("initial_presence_state", (event) => {
            const users = JSON.parse(event.data);
            setOnlineUsers(users);
        });

        // 2. User Joined
        //? update state when a new user joins the group
        es.addEventListener("user_joined", (event) => {
            const newUser = JSON.parse(event.data);
            setOnlineUsers((prev) => {
                //? if userId is present in onlineUsers array then no need to add it again to the array
                //? helps when user is online from multiple tabs
                if (prev.some((u) => u.userId === newUser.userId)) return prev;
                return [...prev, newUser];
            });
        });

        // 3. User Left
        //? update state when a user leaves the group
        es.addEventListener("user_left", (event) => {
            const { userId } = JSON.parse(event.data);
            setOnlineUsers((prev) => prev.filter((u) => u.userId !== userId));
        });

        es.onerror = () => {
            console.log("❌ SSE Disconnected");
            es.close();
        };

        return () => {
            console.log("❌ connection closed for profile page");
            es.close();
        };

    }, [groupId]);

    // console.log("onlineUsers in profile page", onlineUsers);

    //? fetch group details from groupId grabed from query params
    useEffect(() => {
        if (groupId) {
            const fetchGroup = async () => {
                try {
                    const grpDetails = await getGroupDetails(groupId);
                    console.log("grpDetails from Profile page: ", grpDetails);
                    setGroupData(grpDetails);
                } catch (error) {
                    console.log("Error fetching group details: ", error);
                }
            }
            fetchGroup();
        }
    }, [groupId])

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
            <ChatProfile
                className="w-full"
                group={groupData}
                onlineUsers={onlineUsers}
            />
        </div>
    );
};

export default Profile;