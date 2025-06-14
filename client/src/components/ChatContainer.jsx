

import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function ChatContainer() {


    const { authUser, onlineUser } = useContext(AuthContext)

    const {
        selectedUser, setSelectedUser,
        unseenMessage, setUnseenMessage,
        message, setMessage,
        sendMessage,
        
        getMessageSelectedUser } = useContext(ChatContext);

    const [text, setText] = useState("")
    const [image, setImage] = useState(null)

    //handle sending a message
    const onSendHendler = async (e) => {
        e.preventDefault();

        const trimmedText = text.trim();
        if (!trimmedText && !image) return; // optional early return

        if (image) {
            const reader = new FileReader();
            reader.onload = async () => {
                await sendMessage({ image: reader.result, text:trimmedText });
            };
            reader.readAsDataURL(image);
        } else {
            await sendMessage({ text:trimmedText, image: "" });
        }

        setText("");
        setImage(null);
    };

    const scrollEnd = useRef(null);
    useEffect(() => {
        if (selectedUser) {
            getMessageSelectedUser(selectedUser._id)

        }
    }, [selectedUser])

    useEffect(() => {
        if (scrollEnd.current && message) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [message])

     const formatMessageTime = (timestamp) => {
    const now = new Date();
    const msgDate = new Date(timestamp);

    const isToday = now.toDateString() === msgDate.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === msgDate.toDateString();

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    if (isToday) {
        return msgDate.toLocaleTimeString([], timeOptions); // e.g. 2:15 PM
    } else if (isYesterday) {
        return `Yesterday at ${msgDate.toLocaleTimeString([], timeOptions)}`;
    } else {
        return msgDate.toLocaleDateString() + ' at ' + msgDate.toLocaleTimeString([], timeOptions);
    }
};


    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/* header of chat container */}
            <div className='flex text-lg items-center gap-3 py-3 mx-4  border-b border-stone-500'>
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-14 rounded-full' />

                <p className='text-white flex-1 flex gap-3  text-lg items-center ga-2'>{selectedUser.name}
                    {
                        onlineUser.includes(selectedUser._id) && <span className='text-green-500'> online</span>
                    }

                </p>

                <img src={assets.arrow_icon} alt=""
                    className='md:hidden  max-w-7 cursor-pointer'
                    onClick={() => setSelectedUser(false)} />

                <img src={assets.help_icon} alt=""
                    className='max-md:hidden max-w-5' />
            </div>

            {/* chat area */}
            <div className='flex flex-col  h-[calc(100%-120px)] overflow-y-scroll  p-3 pb-6'>
                {
                    message.length > 0 && message.map((msg, idx) => (
                        <div key={idx} className={`flex items-end gap-2 justify-end ${msg.sender !== authUser._id && 'flex-row-reverse'}`}>
                            {
                                msg.image ? (
                                    <img src={msg.image} className=' max-w-[230px] border  border-gray-700  rounded-lg  overflow-hidden mb-8' />
                                )
                                    :
                                    (
                                        <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8  break-all  bg-violet-500/30 tetx-white ${msg.sender === authUser._id ? "rounded-br-none" : "rounded-bl  "}`}>
                                            {
                                                msg.text
                                            }
                                        </p>
                                    )
                            }
                            <div className='text-center text-sm'>
                                <img src={msg.sender !== authUser._id ? selectedUser.profilePic || assets.avatar_icon : authUser.profilePic || assets.avatar_icon} alt=""
                                    className='w-7  rounded-full' />
                                <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>

                            </div>
                        </div>
                    ))
                }
                <div ref={scrollEnd}></div>

            </div>



            {/* bottom area text input */}
            <div className='absolute  bottom-0  left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex bg-gray-100/20 gap-3 items-center px-3 rounded-full'>
                    <input type="text" placeholder='Send a message'
                        className='flex-1 text-sm p-3   border-none rounded-lg outline-none text-white 
                    placeholder-gray-400  bg-transparent'
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => { e.key === 'Enter' ? onSendHendler(e) : null }}
                        value={text} />
                    <input type="file" id='image' accept='image/png,image/jpeg' hidden
                        onChange={(e) => setImage(e.target.files[0])} />
                    <label htmlFor="image">
                        <img src={image || assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
                    </label>

                </div>

                <img src={assets.send_button} alt="" className='w-7 cursor-pointer'
                    onClick={(e) => onSendHendler(e)} />
            </div>
        </div>
    )
        : (
            <div className='flex flex-col  text-white w-full  items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden  mx-auto'>
                <img src={assets.logo_icon} alt="" className='w-14' />
                <p className='text-lg font-medium '>Chat anytime, anywhere</p>
            </div>
        )

}

export default ChatContainer
