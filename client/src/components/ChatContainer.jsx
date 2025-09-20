

import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { X } from 'lucide-react';

import { Sun, Moon } from 'lucide-react'

const ChatContainer = () => {


    const { authUser, onlineUser, updateUserConnections, mode,setMode } = useContext(AuthContext)

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
        defaultDays, setDefaultDays,
    } = useContext(ChatContext);

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
    console.log("mode in chaitcontainer", mode)

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
        <div className={`h-full overflow-scroll relative backdrop-blur-lg w-3xl dark:bg-gray-900 bg-white`}>
            {/* header of chat container */}
            <div className={`flex items-center gap-3 py-3 mx-4 border-b transition-colors duration-200 ${mode === 'dark' ? 'border-stone-500 bg-gray-700/25' : 'border-gray-500 bg-gray-50'}
            ${reqSend ? 'md:w-full' : ''}`}>
                <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt="User profile"
                    className={`w-14 h-14 rounded-full object-cover border-2 ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                />

                <div className='flex-1 flex items-center gap-3'>
                    <p className={`text-lg font-medium transition-colors ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {selectedUser.name}
                    </p>
                    {onlineUser.includes(selectedUser._id) && (
                        <span className='flex items-center gap-1.5 text-sm font-medium text-green-500'>
                            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
                            online
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setMode(p => p === 'dark' ? "light" : "dark")}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110
                                ${mode === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                            : 'bg-blue-100 hover:bg-blue-200 text-orange-500'
                        }`}
                >
                    {mode === 'dark'
                        ? <Moon className="w-5 h-5" />
                        : <Sun className="w-5 h-5" />
                    }
                </button>

                <button
                    className={`md:hidden p-2 rounded-full transition-colors ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedUser(false)}
                >
                    <img
                        src={assets.arrow_icon}
                        alt="Back"
                        className={`w-5 h-5 transition-all ${mode === 'dark' ? 'invert' : ''}`}
                    />
                </button>

                <button
                    className={`max-md:hidden p-2 rounded-full transition-colors ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    onClick={() => setSetting(prev => !prev)}
                >
                    <img
                        src={assets.help_icon}
                        alt="Settings"
                        className={`w-5 h-5 transition-all ${mode === 'dark' ? 'invert' : ''}`}
                    />
                </button>
            </div>

            {/* check selected user in your connections and not */}
            {
                reqSend ? (
                    // send request to selected user
                    <div className="flex flex-col items-center dark:bg-gray-800 bg-white shadow-md rounded-xl mx-auto my-10 py-10 px-5 md:w-[360px] w-[370px] border dark:border-gray-700 border-gray-300">
                        <div className="flex items-center justify-center p-4 bg-red-100 dark:bg-red-900 rounded-full">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="dark:text-white text-gray-900 font-semibold mt-4 text-xl">Request send to user</h2>
                        <p className="text-sm dark:text-gray-300 text-gray-600 mt-2 text-center">
                            Do you really want to connect? This request<br />cannot be undone.
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-5 w-full">
                            <button type="button" className="w-full md:w-36 h-10 rounded-md border dark:border-gray-600 border-gray-300 dark:bg-gray-700 bg-white dark:text-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-600 active:scale-95 transition">
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
                ) : (
                    setting ? (
                        //setting
                        <div className="w-72 mx-auto my-10 px-4 py-5 dark:bg-gray-800/50 bg-blue-100/20 flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
                            <legend className="text-xl font-semibold mb-3 select-none dark:text-white">Disappearing Message</legend>

                            {["24", "7", "90"].map((days) => (
                                <label key={days} htmlFor={days} className="font-medium h-14 relative dark:hover:bg-gray-700 hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg dark:text-white has-[:checked]:text-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/50 has-[:checked]:ring-indigo-300 has-[:checked]:ring-1 select-none">
                                    {days} {days === "24" ? "hours" : "Days"}
                                    <input
                                        value={days}
                                        checked={defaultDays === days}
                                        type="radio"
                                        name="status"
                                        className="peer/html w-4 h-4 absolute accent-current right-3"
                                        id={days}
                                        onChange={() => { setDefaultDays(days); handelUserConnectionUpdate() }}
                                    />
                                </label>
                            ))}

                            <label htmlFor="clear" className="font-medium h-14 relative dark:hover:bg-gray-700 hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg dark:text-white has-[:checked]:text-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/50 has-[:checked]:ring-indigo-300 has-[:checked]:ring-1 select-none">
                                Clear all Chat
                                <input type="radio" name="status" className="w-4 h-4 absolute accent-indigo-500 right-3" id="clear" />
                            </label>
                        </div>
                    ) : (
                        <>
                            {/* chat area */}
                            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6 dark:bg-gray-900 bg-white'>
                                {skeleton ? (
                                    <div className="flex flex-col gap-8 animate-pulse w-full">
                                        {[1, 2, 3, 4, 5, 6].map((item, i) => (
                                            <div key={item} className={`flex w-fit ${i % 2 === 0 ? "flex-row ml-0" : "flex-row-reverse ml-auto"} items-end gap-2`}>
                                                <div className={`flex flex-col items-end gap-2`}>
                                                    {i % 2 === 0 && (
                                                        <div className="w-[100px] h-[100px] dark:bg-gray-700 bg-gray-200 rounded-lg">
                                                            <svg className="w-5/6 h-full dark:text-gray-600 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="w-[200px] h-10 dark:bg-gray-700 bg-gray-200 rounded-lg"></div>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="w-7 h-7 dark:bg-gray-700 bg-gray-200 rounded-full"></div>
                                                    <div className="w-16 h-4 dark:bg-gray-700 bg-gray-200 rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                ) : (
                                    <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                                        {message.length > 0 ? message.map((msg, idx) => (
                                            <div key={idx} className={`flex items-end gap-2 justify-end ${msg.sender !== authUser._id && 'flex-row-reverse'}`}>
                                                {msg.image ? (
                                                    <img src={msg.image} className='max-w-[230px] border dark:border-gray-700 border-gray-200 rounded-lg overflow-hidden mb-8' />
                                                ) : (
                                                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all dark:bg-violet-500/30 bg-violet-100 dark:text-white text-gray-900 ${msg.sender === authUser._id ? "rounded-br-none" : "rounded-bl"}`}>
                                                        {msg.text}
                                                    </p>
                                                )}
                                                <div className='text-center text-sm'>
                                                    <img src={msg.sender !== authUser._id ? selectedUser.profilePic || assets.avatar_icon : authUser.profilePic || assets.avatar_icon} alt=""
                                                        className='w-7 rounded-full' />
                                                    <p className='dark:text-gray-400 text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className='flex flex-col items-center justify-center h-full'>
                                                <div className="animate-bounce mb-4">
                                                    <svg
                                                        className="w-16 h-16 dark:text-gray-400 text-gray-300"
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
                                                <h3 className='text-xl font-semibold dark:text-gray-400 text-gray-500 mb-2'>No Messages Yet</h3>
                                                <p className='dark:text-gray-500 text-gray-400 text-center max-w-sm'>
                                                    Start the conversation by sending your first message!
                                                </p>
                                            </div>
                                        )}
                                        <div ref={scrollEnd}></div>
                                    </div>
                                )}

                                {/* Image preview */}
                                {image && (
                                    <div className="absolute bottom-[70px] left-0 right-0 flex justify-left">
                                        <div className="relative w-[200px]">
                                            <button
                                                onClick={() => setImage(null)}
                                                className="absolute -top-2 -right-2 p-1 dark:bg-gray-800 bg-gray-100 hover:bg-gray-700 rounded-full cursor-pointer transition-colors z-10"
                                            >
                                                <X className="w-4 h-4 dark:text-white text-gray-900" />
                                            </button>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Selected image"
                                                className="w-full h-auto max-h-[130px] rounded-lg object-cover shadow-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Message input */}
                                <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                                    <div className='flex-1 flex dark:bg-gray-800/50 bg-gray-100 gap-3 items-center px-3 rounded-full'>
                                        <input
                                            type="text"
                                            placeholder='Send a message'
                                            className='flex-1 text-sm p-3 border-none rounded-lg outline-none dark:text-white text-gray-900 placeholder-gray-400 bg-transparent'
                                            onChange={(e) => setText(e.target.value)}
                                            onKeyDown={(e) => { e.key === 'Enter' ? onSendHendler(e) : null }}
                                            value={text}
                                        />
                                        <input
                                            type="file"
                                            id='image'
                                            accept='image/png,image/jpeg'
                                            hidden
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                        <label htmlFor="image">
                                            <img src={image || assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer dark:invert' />
                                        </label>
                                    </div>

                                    <img
                                        src={assets.send_button}
                                        alt=""
                                        className='w-7 cursor-pointer dark:invert'
                                        onClick={(e) => onSendHendler(e)}
                                    />
                                </div>
                            </div>
                        </>
                    )
                )}
        </div>
    ) : (
        <div className='flex flex-col w-full h-full items-center justify-center gap-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 max-md:hidden mx-auto transition-all duration-300'>
            <div className='relative group'>
                <div className='absolute -inset-1 bg-gradient-to-r from-violet-400 to-violet-600 dark:from-violet-500 dark:to-violet-700 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300'></div>
                <img
                    src={assets.logo_icon}
                    alt="Chat App Logo"
                    className='relative w-20 h-20 object-contain transition-all duration-300 transform hover:scale-110 dark:invert'
                />
                <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gradient-to-r from-violet-400 to-violet-600 dark:from-violet-500 dark:to-violet-700 rounded-full blur-sm'></div>
            </div>
            <div className='text-center space-y-3'>
                <h1 className='text-2xl font-semibold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-50 bg-clip-text text-transparent'>
                    Chat anytime, anywhere
                </h1>
                <p className='text-base text-gray-600 dark:text-gray-300 transition-colors duration-200'>
                    Select a conversation to start messaging
                </p>
            </div>
            <div className='absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-violet-400/20 dark:via-violet-500/20 to-transparent'></div>
        </div>
    )

}

export default ChatContainer

