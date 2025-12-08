//* Push
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoCallOutline, IoVideocamOutline, IoPersonAddOutline, IoSearchOutline, IoPersonAddSharp } from "react-icons/io5";
import { MdOutlineExitToApp } from "react-icons/md";
import { formatLastSeen } from "../utils/date.js";


const ChatProfile = ({ group, onlineUsers }) => {
  const router = useRouter();
  console.log("onlineUsers from <ChatProfile>", onlineUsers);

  //? loading UI while the data is being fetched
  if (!group) {
    return (
      <div className="w-full md:w-80 flex flex-col h-full overflow-hidden bg-white items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  //? use membersInfo array from the group prop w/ a fallback to an empty arr
  const members = Array.isArray(group.membersInfo) ? group.membersInfo : [];
  // console.log('Avatar URL:', group.avatar);
  // console.log('Group Name:', group.name);
  // console.log('Avatar URL complete:', group.avatar + group.name);
  console.log("members from <ChatProfile>", members);
  //? check if the user is online
  //? was comparing a userIds against the entire onlineUsers array object, rather than checking if the ID existed within that array.

  return (
    <div className="w-full md:w-80 flex flex-col h-full overflow-hidden bg-white">
      {/* Profile Header*/}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-300 bg-white z-10 shadow-sm">
        {/* //? back button - Navigate to the specific group chat page- FIXED */}
        <button
          className="inline-flex items-center border border-gray-300 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors mb-4"
          onClick={() => router.push(`/chatMsg/${group._id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          {/* //? group avatar */}
          <img
            src={group.avatar
              // ? `${group.avatar}=${encodeURIComponent(group.name)}`
              // : "https://ui-avatars.com/api/?name=" + group.name
            }
            alt={group.name || "Group_Name"}
            className="w-20 h-20 rounded-full border border-gray-300 object-cover mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-black mb-1">{group.name || "Group_Name"}</h3>
          {/* //? membersInfo[] length for member count */}
          <p className="text-base text-gray-700 mb-2">
            {members.length} members
          </p>
          <div className="flex items-center justify-center space-x-2 text-base text-gray-600">
            {onlineUsers.isOnline ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Online</span>
              </>
            ) : (
              <span>Offline</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between sm:justify-evenly gap-2 mt-6">
          {/* //? audio call Btn */}
          <button className="flex-1 sm:w-20 h-14 sm:h-[56px] flex flex-col items-center justify-center py-2 px-2 sm:px-4 bg-black text-white rounded-lg hover:bg-black hover:opacity-90 transition-colors shadow-sm">
            <IoCallOutline className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Audio</span>
          </button>
          {/* //? VC Btn */}
          <button className="flex-1 sm:w-20 h-14 sm:h-[56px] flex flex-col items-center justify-center py-2 px-2 sm:px-4 bg-black text-white rounded-lg hover:bg-black hover:opacity-90 transition-colors">
            <IoVideocamOutline className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Video</span>
          </button>
          {/* //? Add member button */}
          <button className="flex-1 sm:w-20 h-14 sm:h-[56px] flex flex-col items-center justify-center py-2 px-2 sm:px-4 bg-black text-white rounded-lg hover:bg-black hover:opacity-90 transition-colors">
            <IoPersonAddOutline className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Add</span>
          </button>
          {/* //? Search btn */}
          <button className="flex-1 sm:w-20 h-14 sm:h-[56px] flex flex-col items-center justify-center py-2 px-2 sm:px-4 bg-black text-white rounded-lg hover:bg-black hover:opacity-90 transition-colors">
            <IoSearchOutline className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium mt-1">Search</span>
          </button>
        </div>

      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
        {/* Group description Section */}
        <div className='p-4 sm:p-6 border-b border-gray-200'>
          {group.description ?
            <div>
              <label className='font-semibold text-base text-black'>Group description: </label>
              <br />
              <label className='font text-base text-black'>{group.description}</label>
            </div>
            :
            <div>
              <label className='font-semibold text-base text-black'>Add group description</label>
              <input type="text" placeholder='Enter group description...' className='border border-gray-300 outline-none h-10 mt-2 pl-3 pr-3 rounded-lg w-full focus:ring-2 focus:ring-black focus:border-black text-base bg-white text-black placeholder-gray-500' />
            </div>}
        </div>

        {/* Shared Media Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-black">Shared Media</h4>
            <button className="text-base text-black hover:text-gray-700 font-medium underline">
              View All
            </button>
          </div>
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop"
              alt="Shared media 1"
              className="w-20 h-20 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
            <img
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=200&fit=crop"
              alt="Shared media 2"
              className="w-20 h-20 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop"
              alt="Shared media 3"
              className="w-20 h-20 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
              alt="Shared media 4"
              className="w-20 h-20 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              alt="Shared media 5"
              className="w-20 h-20 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          </div>
        </div>

        {/* Communication Settings */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="text-base font-semibold text-black mb-4">Communication Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <span className="text-base text-gray-800">Notifications</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-black focus:ring-black border-gray-400 rounded"
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-base text-gray-800">Priority Messages</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-black focus:ring-black border-gray-400 rounded"
              />
            </div>
            <button className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
              </svg>
              <span className="text-base font-medium">Archive Conversation</span>
            </button>
          </div>
        </div>

        {/* Grp members */}
        <div className="p-4 sm:p-6">
          <h4 className="text-base font-semibold text-black mb-4">Group Members</h4>
          <div className="space-y-2">
            {/* Add Members button */}
            <div className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer">
              <div className='w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0'>
                <IoPersonAddSharp className='w-5 h-5 text-white' />
              </div>
              <p className='text-base font-medium'>Add Members</p>
            </div>
            {/* Map over the membersInfo array to display group members. */}
            {(members.length > 0) ? members.map((member, index) => {
              //? check if user is online 
              const isOnline = onlineUsers.some(user => user.userId === member._id);
              return (
                <div key={member._id || index} className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                  <img src={member.avatar
                    ? `${member.avatar}=${encodeURIComponent(member.name)}`
                    : "https://ui-avatars.com/api/?name=" + member.name
                  } alt={member.name} className='w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-300' />

                  <p className='text-base text-black font-medium'>{member.name}</p>
                  <p className={isOnline ? 'text-sm text-emerald-500' : 'text-sm text-gray-400'}>
                    {isOnline
                      ? 'Online'
                      : formatLastSeen(member.lastSeen)
                    }
                  </p>
                </div>
              )
            }) : (
              <p className="text-sm text-gray-500">No members found</p>
            )}
          </div>
        </div>
      </div>

      {/* exit group button - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-300 bg-white z-10 shadow-sm">
        <button className='w-full bg-black h-12 text-white flex items-center justify-center gap-2 rounded-lg hover:bg-gray-800 transition-colors shadow-md'>
          <MdOutlineExitToApp className='w-5 h-5' />
          <p className='text-lg font-medium'>Exit group</p>
        </button>
      </div>

    </div>
  );
};

export default ChatProfile;
