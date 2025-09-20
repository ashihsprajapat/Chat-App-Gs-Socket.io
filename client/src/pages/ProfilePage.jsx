

import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

function ProfilePage() {


    const { authUser, updateProfile, mode } = useContext(AuthContext)

    const [selectedImg, setSelectImg] = useState(null)
    const [name, setName] = useState(authUser.name)
    const [bio, setBio] = useState(authUser.bio)




    const navigate = useNavigate();


    const onHandleSubmit = async (e) => {
        e.preventDefault()
        let body = { bio, name }
        if (!selectedImg) {
            await updateProfile(body)
            navigate("/")
            return
        }

        let reader = new FileReader()
        reader.readAsDataURL(selectedImg)
        reader.onload = async () => {
            const base64Image = reader.result;
            body["profilePic"] = base64Image
            await updateProfile(body)
            navigate("/")
        }



    }


    return (
        <div className={`bg-cover bg-no-repeat min-h-screen flex items-center justify-center ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-300'}`}>

            <div className={`w-5/6 max-w-2xl ${mode === 'dark' ? 'text-gray-300 border-gray-600 bg-gray-800/50' : 'text-gray-700 border-gray-300 bg-white/50'} border-2 max-sm:flex-col-reverse px-4 py-10 flex flex-col md:flex-row backdrop-blur-xl rounded-lg justify-between items-center`}>

                <form className='flex flex-col gap-5 sm:p-2 md:p-5 flex-1'
                    onSubmit={onHandleSubmit}>
                    <p className={`text-lg ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Profile Details</p>

                    <div className='flex gap-5 items-center'>
                        <label htmlFor="avtar">
                            <img src={selectedImg ? selectedImg :
                                assets.avatar_icon
                            } alt="" className={`w-12 h-12 ${selectedImg && "rounded-full"} cursor-pointer`} />
                        </label>

                        <input type="file" id='avtar' hidden accept='.png , .jpg , .jpeg'
                            onChange={(e) => setSelectImg(e.target.files[0])} />

                        <p className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Upload profile image</p>
                    </div>
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`bg-transparent border rounded-md p-2 outline-none ${mode === 'dark' ? 'border-gray-500 text-gray-200' : 'border-gray-400 text-gray-800'} w-full max-w-xl`} />

                    <textarea
                        name=""
                        id=""
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={`bg-transparent w-full rounded-md outline-none p-2 border ${mode === 'dark' ? 'border-gray-500 text-gray-200' : 'border-gray-400 text-gray-800'}`}></textarea>

                    <button
                        type="submit"
                        className='border bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 text-lg cursor-pointer font-medium mx-5 py-2 rounded-full'>Save</button>
                </form>
                <img src={authUser.profilePic !== "" ? authUser.profilePic : assets.logo_icon} alt="" className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' />

            </div>
        </div>
    )
}

export default ProfilePage
