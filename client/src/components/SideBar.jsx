
import React, { useContext, useEffect, useState } from 'react'
import assets, { userDummyData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Sun, Moon } from 'lucide-react'

function SideBar() { //{ selectedUser, setSelectedUser }

    const { logout, onlineUser, token, authUser, mode, setMode } = useContext(AuthContext)
    // console.log("online user are", onlineUser)

    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [showAllOnline, setShowOnlineUsers] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState([])



    const { sideBarUsers, getSideBarUser,
        selectedUser, setSelectedUser,
        unseenMessage, setUnseenMessage,
        getMessageSelectedUser,
        skeleton, setSkeleton } = useContext(ChatContext);

    // console.log("side bar users are", sideBarUsers)

    useEffect(() => {
        let filtered = sideBarUsers;

        // Apply search filter
        if (query.trim().length > 0) {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Apply online user filter if enabled
        if (showAllOnline) {
            filtered = filtered.filter((user) => onlineUser.includes(user._id));
        }

        setFilteredUsers(filtered);
    }, [query, showAllOnline, token, onlineUser, sideBarUsers]);

    console.log("mode is", mode)

    //console.log(filteredUsers)

    useEffect(() => {
        getSideBarUser()
    }, [onlineUser])


    return (
        <div className={`h-full p-5 rounded-r-xl overflow-y-scroll transition-colors duration-300
            ${mode === 'dark' 
                ? 'bg-[#1a1a2e] text-white' 
                : 'bg-[#f0f2f5] text-gray-800'} 
            ${selectedUser ? "max-md:hidden" : ""}`}>

            {/* header */}
            <div className='pb-5'>
                <div className='flex items-center justify-between pb-5 w-full'>
                    <div className='flex-shrink-0'>
                        <img src={assets.logo} alt="Logo" className='max-w-40 h-auto' />
                    </div>
                    
                    <div className='flex items-center gap-4'>
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

                        <div className='py-2 group relative'>
                            <img 
                                className={`max-h-5 cursor-pointer hover:opacity-80 transition-opacity
                                    ${mode === 'dark' ? '' : 'invert'}`}
                                src={assets.menu_icon} 
                                alt="Menu" 
                            />
                            <div className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md 
                                shadow-lg transition-all duration-200 hidden group-hover:block
                                ${mode === 'dark' 
                                    ? 'bg-[#282142] border-gray-600 text-gray-100' 
                                    : 'bg-white border-gray-200 text-gray-800'}`}>
                                <p className='cursor-pointer text-sm hover:text-gray-400 transition-colors'
                                    onClick={() => (navigate("/profile"))}>
                                    Edit Profile
                                </p>
                                <hr className={`my-2 border-t ${mode === 'dark' ? 'border-gray-600' : 'border-gray-200'}`} />
                                <p className='cursor-pointer text-sm hover:text-gray-400 transition-colors'
                                    onClick={logout}>
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* searchBar */}
                <div className={`flex items-center gap-2 border pl-4 h-[46px] rounded-full overflow-hidden max-w-md w-full
                    ${mode === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-300'}`}>
                    <img src={assets.search_icon} alt="" className={`w-3 ${mode === 'dark' ? 'invert' : ''}`} />
                    <input 
                        type="text" 
                        placeholder="Search User..." 
                        className={`w-full h-full outline-none text-sm
                            ${mode === 'dark' 
                                ? 'bg-gray-800 text-gray-200 placeholder-gray-400' 
                                : 'bg-white text-gray-700 placeholder-gray-500'}`}
                        onChange={(e) => setQuery(e.target.value)} 
                    />
                </div>

                {/* show filter - all online users, lastmessage  */}
                <div className='flex mt-2 gap-3'>
                    <input 
                        type="checkbox" 
                        className={`accent-${mode === 'dark' ? 'purple' : 'blue'}-500`}
                        onChange={(e) => setShowOnlineUsers(e.target.checked)} 
                    />
                    <p>Show all online Users</p>
                </div>
            </div>

            {/* users */}
            <div className='flex flex-col'>
                {
                    filteredUsers.map((user, idx) => (
                        <div 
                            key={idx} 
                            className={`h-15 flex px-3 my-2 items-center gap-3 cursor-pointer rounded-md sm:py-1 md:py-2
                                ${mode === 'dark'
                                    ? 'hover:bg-gray-800/45'
                                    : 'hover:bg-gray-300/60'}
                                ${selectedUser && user._id === selectedUser._id && 
                                    (mode === 'dark' ? 'bg-gray-700/25' : 'bg-gray-300/25')}`}
                            onClick={() => {
                                setSelectedUser(user);
                                setUnseenMessage(prev => ({ ...prev, [user._id]: 0 }));
                                getMessageSelectedUser(user._id);
                                setSkeleton(true)
                            }}>
                            <div className='relative'>
                                <img 
                                    src={user.profilePic || assets.avatar_icon} 
                                    alt="" 
                                    className='w-[35px] aspect-[1/1] rounded-full' 
                                />
                                {onlineUser.includes(user._id) &&
                                    <div className='bg-green-400 p-1 rounded-full absolute bottom-0'></div>
                                }
                            </div>
                            <div className='flex w-full pr-7 justify-between items-center'>
                                <p>{user.name}</p>
                                {unseenMessage[user._id] > 0 &&
                                    <p className={`px-1 rounded-full
                                        ${mode === 'dark' 
                                            ? 'bg-violet-500/50' 
                                            : 'bg-violet-400/50'}`}>
                                        {unseenMessage[user._id]}
                                    </p>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default SideBar
