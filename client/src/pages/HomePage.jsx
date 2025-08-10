

import React, { useContext, useState } from 'react'
import ChatContainer from '../components/ChatContainer'
import SideBar from '../components/SideBar'
import RightSideBar from '../components/RightSideBar'
import assets from './../assets/assets';
import { ChatContext } from '../context/ChatContext';

function HomePage() {

    // const { selectedUser, setSelectedUser} = useState(true)

    const { selectedUser, setSelectedUser, reqSend, setReqSend } = useContext(ChatContext)
    const { newReq } = useContext(ChatContext)

    console.log("new Request is ", newReq)


    return (
        <div className=' w-full  h-screen sm:px-[15%] sm:py-[5%]' >
            {/* HomePage */}

            <div className={`border-2 border-gray-600 rounded-2xl h-[100%] grid grid-cols-1 
            relative backdrop-blur-xl overflow-hidden  ${selectedUser ? " md:grid-cols-[1fr_1.5fr_1fr]  xl:grid-cols-[1fr_2fr_1fr] "
                    :
                    "md:grid-cols-2"
                }  `}>

                <SideBar />

                <ChatContainer />

                {
                    !reqSend &&
                    <RightSideBar />
                }


            </div>
            {newReq && (
                <div>
                    <img src={newReq.profilePic} alt="" />
                    <p>{newReq.name}</p>
                </div>
            )}
        </div>
    )
}

export default HomePage
