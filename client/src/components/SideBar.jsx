
import React, { useContext, useEffect, useState } from 'react'
import assets, { userDummyData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function SideBar() { //{ selectedUser, setSelectedUser }

    const { logout, onlineUser,token,authUser } = useContext(AuthContext)
    // console.log("online user are", onlineUser)

    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [showAllOnline, setShowOnlineUsers] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState([])



    const { sideBarUsers, getSideBarUser,
        selectedUser, setSelectedUser,
        unseenMessage, setUnseenMessage,
        getMessageSelectedUser } = useContext(ChatContext);

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
    }, [query, showAllOnline,token, onlineUser, sideBarUsers]);



    //console.log(filteredUsers)

    useEffect(() => {
        getSideBarUser()
    }, [onlineUser])


    return (
        <div className={`h-full  p-5 rounded-r-xl text-white overflow-y-scroll bg-[#8185B2]/10 
        ${selectedUser ? "max-md:hidden" : ""}`}>


            {/* header */}

            <div className='pb-5'>


                <div className='flex justify-between     items-center pb-5 '>
                    <img src={assets.logo} alt="" className='max-w-40' />
                    <div className='py-2 group relative '>
                        <img className='max-h-5 cursor-pointer' src={assets.menu_icon} alt="" />
                        <div className='border top-full absolute right-0 z-20 w-32 p-5 rounded-md border-gray-600
                        text-gray-100 hidden group-hover:block bg-[#282142] '>
                            <p className='cursor-pointer text-sm'
                                onClick={() => (navigate("/profile"))}> Edit Profile</p>

                            <hr className='my-2 border-t border-gray-500' />
                            <p className='cursor-pointer text-sm'
                                onClick={logout}> Logout</p>
                                <hr className='my-2 border-t border-gray-500' />
                            <p className='cursor-pointer text-sm'
                                onClick={() => (navigate("/all-request"))}> All Request</p>

                        </div>
                    </div>
                </div>

                {/* searchBar */}
                <div class="flex items-center gap-2 border pl-4 gap-2 bg-white border-gray-500/30 h-[46px] rounded-full overflow-hidden max-w-md w-full">
                    <img src={assets.search_icon} alt="" className='invert w-3' />
                    <input type="text" placeholder="Search User..." class="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-sm"
                        onChange={(e) => setQuery(e.target.value)} />
                </div>

                {/* show filter - all online users, lastmessage  */}
                <div className='flex mt-2 gap-3'>
                    <input type="checkbox" name="" id="" onChange={(e) => setShowOnlineUsers(e.target.checked)} />
                    <p>Show all online Users</p>
                </div>


            </div>



            {/* userses */}

            <div className='flex flex-col'>

                {
                    filteredUsers.map((user, idx) => (

                        <div key={idx} className={`h-15 flex px-3 my-2 items-center gap-3
                            cursor-pointer hover:bg-gray-800/45 
                            rounded-md sm:py-1 md:py-2
                        ${selectedUser && user._id === selectedUser._id && "bg-gray-500/25  h-full w-full "}`}
                            onClick={() => {
                                setSelectedUser(user); setUnseenMessage(prev => ({ ...prev, [user._id]: 0 }));
                                getMessageSelectedUser(user._id)
                            }}>
                            <div className='relative'>
                                <img src={user.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full ' />
                                {
                                    // onlien check
                                    onlineUser.includes(user._id) &&
                                    <div className='bg-green-400 p-1 rounded-full absolute bottom-0'>

                                    </div>}
                            </div>
                            <div className='flex w-full pr-7 justify-between items-center '>
                                <p>{user.name}</p>
                                <>
                                    {
                                        //unseenmessage
                                        unseenMessage[user._id] > 0 &&
                                        <p className='  px-1 bg-violet-500/50 items-center rounded-full  '>
                                            {unseenMessage[user._id]}
                                        </p>
                                    }</>
                            </div>


                        </div>
                    ))
                }

            </div>


        </div>
    )
}


export default SideBar
