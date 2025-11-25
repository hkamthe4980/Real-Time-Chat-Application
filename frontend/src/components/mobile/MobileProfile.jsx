// 'use client';
// import React from 'react';

// const MobileProfile = ({ conversation, onBack }) => {
//   if (!conversation || !conversation.isGroup) return null;

//   const members = conversation.members || [];

//   return (
//     <div className="mobile-profile h-full flex flex-col bg-white">
//       {/* Header */}
//       <div className="bg-[#0056b3] text-white px-4 py-3 flex items-center">
//         <button
//           onClick={onBack}
//           className="p-1 hover:bg-blue-600 rounded-full transition-colors mr-3"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <h2 className="text-lg font-semibold">Group Info</h2>
//       </div>

//       {/* Profile Content */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         {/* Group Photo Header */}
//         <div className="bg-white">
//           <div className="relative">
//             <div className="w-full h-48 bg-gradient-to-br from-[#0056b3] to-[#004494] flex items-center justify-center">
//               <img
//                 src={conversation.avatar}
//                 alt={conversation.name}
//                 className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//               />
//             </div>
//             <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors">
//               <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//             </button>
//           </div>
          
//           {/* Group Name and Description */}
//           <div className="px-4 py-4">
//             <h3 className="text-xl font-semibold text-gray-900 mb-1">{conversation.name}</h3>
//             {conversation.description && (
//               <p className="text-sm text-gray-600 mb-2">{conversation.description}</p>
//             )}
//             <p className="text-sm text-gray-500">{conversation.memberCount} members</p>
//           </div>
//         </div>

//         {/* Members Section */}
//         <div className="bg-white mt-2">
//           <div className="px-4 py-3 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h4 className="text-base font-semibold text-gray-900">Members</h4>
//               <button className="text-sm text-[#0056b3] font-medium">
//                 {conversation.memberCount}
//               </button>
//             </div>
//           </div>
          
//           <div className="px-4 py-2">
//             {members.map((member, index) => (
//               <div
//                 key={member.id || index}
//                 className="flex items-center py-3 border-b border-gray-100 last:border-0"
//               >
//                 <img
//                   src={member.avatar}
//                   alt={member.name}
//                   className="w-12 h-12 rounded-full object-cover mr-3"
//                 />
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-2">
//                     <p className="text-base font-medium text-gray-900">{member.name}</p>
//                     {member.role === 'admin' && (
//                       <span className="text-xs bg-[#FCD34D] text-[#0056b3] px-2 py-0.5 rounded-full font-medium">
//                         Admin
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button className="p-2 text-gray-400 hover:text-gray-600">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             ))}
            
//             {/* Add Member Button */}
//             <button className="flex items-center py-3 text-[#0056b3] w-full">
//               <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//               </div>
//               <span className="text-base font-medium">Add member</span>
//             </button>
//           </div>
//         </div>

//         {/* Media, Links, Docs Section */}
//         <div className="bg-white mt-2">
//           <div className="px-4 py-3 border-b border-gray-200">
//             <h4 className="text-base font-semibold text-gray-900">Media, Links, and Docs</h4>
//           </div>
          
//           <div className="px-4 py-2">
//             {/* Media */}
//             <button className="flex items-center justify-between py-3 w-full border-b border-gray-100">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
//                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-base font-medium text-gray-900">Media</p>
//                   <p className="text-xs text-gray-500">Photos, videos, and GIFs</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-500">24</span>
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </button>

//             {/* Links */}
//             <button className="flex items-center justify-between py-3 w-full border-b border-gray-100">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
//                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                   </svg>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-base font-medium text-gray-900">Links</p>
//                   <p className="text-xs text-gray-500">Shared links and URLs</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-500">8</span>
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </button>

//             {/* Docs */}
//             <button className="flex items-center justify-between py-3 w-full">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
//                   <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-base font-medium text-gray-900">Docs</p>
//                   <p className="text-xs text-gray-500">Documents and files</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-500">5</span>
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Group Settings */}
//         <div className="bg-white mt-2">
//           <div className="px-4 py-3 border-b border-gray-200">
//             <h4 className="text-base font-semibold text-gray-900">Group Settings</h4>
//           </div>
          
//           <div className="px-4 py-2">
//             {/* Mute Notifications */}
//             <div className="flex items-center justify-between py-3 border-b border-gray-100">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//                 </svg>
//                 <span className="text-base text-gray-900">Mute Notifications</span>
//               </div>
//               <input
//                 type="checkbox"
//                 className="w-5 h-5 text-[#0056b3] focus:ring-[#0056b3] border-gray-300 rounded"
//               />
//             </div>

//             {/* Disappearing Messages */}
//             <div className="flex items-center justify-between py-3 border-b border-gray-100">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span className="text-base text-gray-900">Disappearing Messages</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-500">Off</span>
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </div>

//             {/* Group Description */}
//             <button className="flex items-center justify-between py-3 border-b border-gray-100 w-full">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 <span className="text-base text-gray-900">Edit Group Description</span>
//               </div>
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Danger Zone */}
//         <div className="bg-white mt-2 mb-4">
//           <div className="px-4 py-2">
//             <button className="flex items-center justify-center py-3 w-full text-red-600">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               <span className="text-base font-medium">Exit Group</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MobileProfile;









"use client";
import React from "react";

const MobileProfile = ({ conversation, onBack }) => {
  if (!conversation || !conversation.isGroup) return null;

  const members = conversation.members || [];

  return (
    <div className="mobile-profile h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#0056b3] text-white px-4 py-3 flex items-center">
        <button onClick={onBack} className="p-1 hover:bg-blue-600 rounded-full transition-colors mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">Group Info</h2>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Group Photo Header */}
        <div className="bg-white">
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-br from-[#0056b3] to-[#004494] flex items-center justify-center">
              <img src={conversation.avatar} alt={conversation.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
            </div>
            <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Group Name and Description */}
          <div className="px-4 py-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{conversation.name}</h3>
            {conversation.description && <p className="text-sm text-gray-600 mb-2">{conversation.description}</p>}
            <p className="text-sm text-gray-500">{conversation.memberCount} members</p>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white mt-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900">Members</h4>
              <button className="text-sm text-[#0056b3] font-medium">{conversation.memberCount}</button>
            </div>
          </div>

          <div className="px-4 py-2">
            {members.map((member, index) => (
              <div key={member._id || member.id || index} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                <img src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6B7280&color=FFFFFF`} alt={member.name} className="w-12 h-12 rounded-full object-cover mr-3" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-base font-medium text-gray-900">{member.name}</p>
                    {member.role === "admin" && <span className="text-xs bg-[#FCD34D] text-[#0056b3] px-2 py-0.5 rounded-full font-medium">Admin</span>}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add Member Button */}
            <button className="flex items-center py-3 text-[#0056b3] w-full">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-base font-medium">Add member</span>
            </button>
          </div>
        </div>

        {/* Media, Links, Docs & Settings (same layout as you provided) */}
        <div className="bg-white mt-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h4 className="text-base font-semibold text-gray-900">Media, Links, and Docs</h4>
          </div>
          <div className="px-4 py-2">
            {/* (kept simple) */}
            <button className="flex items-center justify-between py-3 w-full border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-base font-medium text-gray-900">Media</p>
                  <p className="text-xs text-gray-500">Photos, videos, and GIFs</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">24</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileProfile;
