
import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

function RightSideBar() {

    const { onlineUser, mode } = useContext(AuthContext)

    const { message, selectedUser } = useContext(ChatContext)

    const [msgImages, setMsgImage] = useState([])

    useEffect(() => {

        setMsgImage(message.filter(msg => ( msg.image && msg.image !== "")))

    }, [selectedUser, message]) 

    return selectedUser && (
        <div className={`${mode === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-[#8185B2]/10 text-white'} w-full relative overflow-scroll 
        ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className='pt-16 flex flex-col flex-1 items-center gap-2 text-xs font-light mx-auto'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
                <h1 className={`${mode === 'light' ? 'text-gray-800' : 'text-white'} px-10 font-medium text-xl flex mx-auto items-center gap-2`}>
                    {
                        onlineUser.includes(selectedUser._id) &&
                        <p className='w-2 h-2 rounded-full bg-green-500 p-1'></p>
                    }
                    {selectedUser.name}</h1>
            </div>
            <p className='px-10 mx-auto'>{selectedUser.bio}</p>
            <hr className={`${mode === 'light' ? 'border-gray-300' : 'border-gray-600'} my-4 mx-3`} />

            <div className='px-5 text-xs'>
                <p>Media</p>
                <div className='mt-2 max-h-[280px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-75'>
                    {
                        msgImages.map((msg, idx) => (
                            <div key={idx} className='cursor-pointer rounded'
                                onClick={() => window.open(msg.image)}>
                                <img src={msg.image} className='h-full rounded-md' alt={msg.text} />
                            </div>
                        ))
                    }
                </div>
            </div>

            <button className={`cursor-pointer py-2 px-20 rounded-full font-light text-sm ${mode === 'light' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-purple-400 to-violet-600'} text-white border-none absolute bottom-5 left-1/2 transform -translate-x-1/2`}>
                Block
            </button>
        </div>
    )
}

export default RightSideBar
