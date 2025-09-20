

import React, { useContext, useState } from 'react'
import ChatContainer from '../components/ChatContainer'
import SideBar from '../components/SideBar'
import RightSideBar from '../components/RightSideBar'
import assets from './../assets/assets';
import { ChatContext } from '../context/ChatContext';
import AllRequests from './AllRequests';

function HomePage() {

    // const { selectedUser, setSelectedUser} = useState(true)

    const [allRequestShow, setAllRequestShow] = useState(false);

    const { selectedUser, setSelectedUser, reqSend, setReqSend } = useContext(ChatContext)
    const { newReq } = useContext(ChatContext)



    return (
        <div className='w-full h-screen sm:px-[15%] sm:py-[5%]'>
            {/* HomePage */}

            <div className={`border-2 rounded-2xl h-[100%] grid grid-cols-1 
            relative backdrop-blur-xl overflow-hidden
            dark:border-gray-600 dark:bg-gray-900 
            light:border-gray-300 light:bg-white
            ${selectedUser 
                ? reqSend
                    ? "md:grid-cols-[1fr_2.5fr] xl:grid-cols-[1fr_3fr]"
                    : "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
                : "md:grid-cols-2"
            }`}>

                <SideBar />

                <ChatContainer />

                {!reqSend && <RightSideBar />}

            </div>

            {newReq && (
                <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg
                               dark:bg-gray-800 dark:text-white
                               light:bg-white light:text-gray-900">
                    <img
                        src={newReq.profilePic}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mb-2"
                    />
                    <p className="font-medium">{newReq.name}</p>
                </div>
            )}

            <AllRequests
                allRequestShow={allRequestShow}
                setAllRequestShow={setAllRequestShow}
            />

        </div>
    )
}

export default HomePage
