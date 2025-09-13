

import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { X } from 'lucide-react';

function ChatContainer() {


    const { authUser, onlineUser, updateUserConnections } = useContext(AuthContext)

    const {
        selectedUser, setSelectedUser,
        message,
        sendMessage,
        reqSend,
        sendRequest,
        getMessageSelectedUser,
        setting, setSetting,
        skeleton,
        sendingReqLoading,
        defaultDays, setDefaultDays } = useContext(ChatContext);

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
                await sendMessage({ image: reader.result, text: trimmedText });
            };
            reader.readAsDataURL(image);
        } else {
            await sendMessage({ text: trimmedText, image: "" });
        }

        setText("");
        setImage(null);
    };

    const scrollEnd = useRef(null);
    useEffect(() => {
        if (selectedUser) {
            getMessageSelectedUser(selectedUser._id)

        }
    }, [selectedUser, setSetting])

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


    const handleSendRequest = () => {

        sendRequest(selectedUser._id)
    }

    //update user connection data
    const handelUserConnectionUpdate = () => {
        updateUserConnections(defaultDays, selectedUser._id)


    }


    return selectedUser ? (
        <div className={`h-full  overflow-scroll relative backdrop-blur-lg w-3xl `}>
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
                    onClick={() => { setSelectedUser(false); }} />

                <img src={assets.help_icon} alt=""
                    className='max-md:hidden max-w-5 cursor-pointer'
                    onClick={() => setSetting(prev => (!prev))} />
            </div>

            {/* check selected user in your connections and not */}
            {

                reqSend ?
                    (
                        // send request to selected user
                        <div class="flex flex-col   items-center bg-white shadow-md rounded-xl mx-auto my-10 py-10 px-5 md:w-[360px] w-[370px] border border-gray-300">
                            <div class="flex items-center justify-center p-4 bg-red-100 rounded-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <h2 class="text-gray-900 font-semibold mt-4 text-xl">Request send to user</h2>
                            <p class="text-sm text-gray-600 mt-2 text-center">
                                Do you really want to connect? This request<br />cannot be undone.
                            </p>
                            <div class="flex items-center justify-center gap-4 mt-5 w-full">
                                <button type="button" class="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendRequest}
                                    disabled={sendingReqLoading}
                                    type="button"
                                    className={`w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 ${sendingReqLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {sendingReqLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        'Confirm'
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                    :
                    (
                        setting ?
                            (
                                //setting
                                <div class="w-72 mx-auto my-10 px-4 py-5 bg-blue-100/20 flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
                                    <legend class="text-xl font-semibold mb-3 select-none">Dessappeaing Message</legend>

                                    <label for="html" name="status" class="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:ring-indigo-300 has-[:checked]:ring-1 select-none">

                                        24 hourse
                                        <input
                                            value="24"
                                            checked={defaultDays === "24"}
                                            type="radio"
                                            name="status"
                                            className="peer/html w-4 h-4 absolute accent-current right-3"
                                            id="html"
                                            onChange={() => { setDefaultDays("24"); handelUserConnectionUpdate() }}


                                        />

                                    </label>

                                    <label for="css" class="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:ring-indigo-300 has-[:checked]:ring-1 select-none">

                                        7 Days
                                        <input value="7" type="radio"
                                            checked={defaultDays === "7"}
                                            name="status" class="w-4 h-4 absolute accent-current right-3" id="css"
                                            onChange={() => { setDefaultDays("7"); handelUserConnectionUpdate() }} />
                                    </label>
                                    <label for="javascript" name="html" class="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:ring-indigo-300 has-[:checked]:ring-1 select-none">
                                        90 Days
                                        <input type="radio" value="24" name="status"
                                            checked={defaultDays === "90"}
                                            class="w-4 h-4 absolute accent-indigo-500 right-3" id="javascript"
                                            onChange={() => { setDefaultDays("90"); handelUserConnectionUpdate() }} />

                                    </label>

                                    <label for="javascript" name="html" class="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:ring-indigo-300 has-[:checked]:ring-1 select-none">
                                        Clear all Chat
                                        <input type="radio" name="status" class="w-4 h-4 absolute accent-indigo-500 right-3" id="javascript" />
                                    </label>
                                </div>
                            )
                            :
                            (

                                <>
                                    {/* chat area */}
                                    {
                                        skeleton ? (
                                            < div className='flex flex-col  h-[calc(100%-120px)] overflow-y-scroll  p-3 pb-6'>

                                                <div className="flex flex-col gap-8 animate-pulse w-full">
                                                    {[1, 2, 3, 4, 5, 6].map((item, i) => (
                                                        <div key={item} className={`flex  w-fit ${i % 2 === 0 ? "flex-row ml-0" : "flex-row-reverse ml-auto"} items-end gap-2`}>
                                                            <div className={`flex flex-col   items-end gap-2`}>
                                                                {/* Skeleton for image message */}
                                                                {
                                                                    i % 2 === 0 &&
                                                                    (<div className="w-[100px] h-[100px] bg-gray-700 rounded-lg">
                                                                        <svg className="w-5/6 h-full text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                                                        </svg>
                                                                    </div>)
                                                                }

                                                                {/* Skeleton for text message */}
                                                                <div className="w-[200px] h-10 bg-gray-700 rounded-lg"></div>
                                                            </div>
                                                            {/* Skeleton for user avatar and timestamp */}
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="w-7 h-7 bg-gray-700 rounded-full"></div>
                                                                <div className="w-16 h-4 bg-gray-700 rounded-full"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <span className="sr-only">Loading...</span>
                                                </div>


                                            </div>
                                        ) : (
                                            < div className='flex flex-col  h-[calc(100%-120px)] overflow-y-scroll  p-3 pb-6'>
                                                {
                                                    message.length > 0 ? message.map((msg, idx) => (
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
                                                        :
                                                        (
                                                            <div className='flex flex-col items-center justify-center h-full'>
                                                                <div className="animate-bounce mb-4">
                                                                    <svg
                                                                        className="w-16 h-16 text-gray-400"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={1.5}
                                                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <h3 className='text-xl font-semibold text-gray-400 mb-2'>No Messages Yet</h3>
                                                                <p className='text-gray-500 text-center max-w-sm'>
                                                                    Start the conversation by sending your first message!
                                                                </p>
                                                            </div>
                                                        )
                                                }
                                                <div ref={scrollEnd}></div>

                                            </div>
                                        )
                                    }


                                    {/* bottom area text input */}


                                    {
                                        image && (
                                            <div className="absolute bottom-[70px] left-0 right-0 flex justify-left">

                                                <div className="relative w-[200px]">
                                                    <button
                                                        onClick={() => setImage(null)}
                                                        className="absolute -top-2 -right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded-full cursor-pointer transition-colors z-10"
                                                    >
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt="Selected image"
                                                        className="w-full h-auto max-h-[130px] rounded-lg object-cover shadow-lg"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className='absolute  bottom-0  left-0 right-0 flex items-center gap-3 p-3'>



                                        <div className='flex-1  flex bg-gray-100/20 gap-3 items-center px-3 rounded-full'>
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




                                </>

                            )
                    )
            }





        </div >
    )
        : (
            <div className='flex flex-col  text-white w-full  items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden  mx-auto'>
                <img src={assets.logo_icon} alt="" className='w-14' />
                <p className='text-lg font-medium '>Chat anytime, anywhere</p>
            </div>
        )

}

export default ChatContainer
