"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatProfile from '@/components/ChatProfile';
//? import API call method
import { getGroupDetails } from '@/utils/api';
// import '@/styles/mobile-chat.css';

const Profile = ({}) => {
    //? get groupId from query
    const searchParams = useSearchParams();
    const groupId = searchParams.get('groupId');
    console.log("groupId form query: ", groupId);
    // console.log("groupId in profile", groupId);

    const [groupData, setGroupData] = useState(null);
    // if (!groupData) return null;

    //? fetch group details from groupId grabed from query params
    useEffect(() => {
        if(groupId) {
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
            />
        </div>
    );
};

export default Profile;