
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContext'

function AllRequests() {
    const { authUser, axios } = useContext(AuthContext)

    const {acceptRequest}= useContext(ChatContext);

    const [allRequestedUser, setAllRequestedUser] = useState(null)

    const getAllRequestedUsers = async () => {
        if (!authUser)
            return
        const { data } = await axios.get(`/api/user/get-request/${authUser._id}`)

        if (data.success) {
            setAllRequestedUser(data.allRequestUsers)
        }
    }


    useEffect(() => {
        getAllRequestedUsers()
    }, [authUser])


    


    return (
        <div className=' bg-cover    min-h-screen bg-no-repeat flex items-center  text-white  '>

            <div className="flex-1  flex flex-col ">
                <div className="w-full md:p-10 p-4">
                    <h2 className="pb-4 text-lg font-medium">All Reuests</h2>
                    <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                        <table className="md:table-auto table-fixed w-full overflow-hidden">
                            <thead className="text-gray-900 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold truncate">Profile pic</th>
                                    <th className="px-4 py-3 font-semibold truncate">Name</th>
                                    <th className="  px-4 py-3 font-semibold truncate hidden md:table-cell">Email</th>
                                    <th className="px-4  py-3 font-semibold truncate hidden md:table-cell"> Bio</th>
                                    <th className="px-4 py-3 font-semibold truncate">Accept</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-500">
                                {
                                    allRequestedUser ?
                                        (allRequestedUser.map((user, idx) => (
                                            <tr key={idx} className="border-t border-gray-500/20">
                                                <td>
                                                    <img className='w-10 cursor-pointer rounded-full mx-4 h-10' src={user.profilePic || assets.avatar_icon} alt="" />
                                                </td>
                                                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                                    <div className=" p-2">
                                                        <p className='text-md'>{user.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4  py-3 hidden md:table-cell">{user.email}</td>
                                                <td className="px-4  py-3 hidden md:table-cell">${user.bio}</td>
                                                <td className="px-4 py-3">
                                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                                        <input type="checkbox" className="sr-only peer" onChange={(e) => { acceptRequest(true, user._id) }} />
                                                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        )))
                                        : (
                                            <tr>

                                                <td>No request </td>
                                            </tr>
                                        )

                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AllRequests
