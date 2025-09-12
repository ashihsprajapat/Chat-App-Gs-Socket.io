
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContext'

function AllRequests({ allRequestShow, setAllRequestShow }) {
    const { authUser, axios } = useContext(AuthContext)

    const { acceptRequest,getAllRequestedUsers,allRequestedUser, setAllRequestedUser } = useContext(ChatContext);

    useEffect(() => {
        if(authUser)
            getAllRequestedUsers()
    }, [authUser])





    return (
        <>

            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setAllRequestShow(!allRequestShow)}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3 flex items-center gap-2 shadow-lg transition-all"
                >
                    <svg className={`w-6 h-6 transform transition-transform ${allRequestShow ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="font-medium">Friend Requests</span>
                </button>

                {allRequestShow && (
                    <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-600 text-white font-semibold">
                            Pending Requests
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {allRequestedUser.map((user, idx) => (
                                <div key={idx} className="p-3 border-b hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.profilePic || assets.avatar_icon}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={() => acceptRequest(true, user._id)}
                                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                                    >
                                        Accept
                                    </button>
                                </div>
                            ))}
                            {allRequestedUser.length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                    No pending requests
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </>
    )

}

export default AllRequests
