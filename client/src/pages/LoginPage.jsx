

import React, { useContext, useState } from 'react'
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const { login,logout } = useContext(AuthContext)

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log(name, email, password)




        if (state === 'register' && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return
        }

        const body = { name, email, password, bio }
        login(state, body)
    }


    return (
        <div className="min-h-screen bg-cover  bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

            <img className="w-[min(30vw,250px)] mx-auto" src={assets.logo_big} alt="leftSideImage" />


            <form className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col  gap-6 shadow-lg mx-auto rounded-xl min-w-3xl"
                onSubmit={onSubmitHandler}>
                <p className="text-2xl font-medium m-auto  flex gap-5">
                    <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                    {
                        isDataSubmitted &&
                        <img src={assets.arrow_icon} alt="" className='w-5  cursor-pointer'
                            onClick={() => setIsDataSubmitted(false)} />

                    }
                </p>
                {state === "register" && !isDataSubmitted && (


                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Full Name" className="border border-gray-200 rounded-md  focus:outline-none w-full p-2 mt-1 outline-indigo-500 bg-transparent" type="text" required />
                )}
                {
                    !isDataSubmitted && (

                        <>


                            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="border border-gray-500 rounded-md bg-transparent  w-full p-2 mt-1 outline-indigo-500 focus:outline-none" type="email" required />


                            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500
                            bg-transparent" type="password" required />


                        </>
                    )
                }




                {(state === "register" && !isDataSubmitted) ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                )}

                {
                    (state === "register" && isDataSubmitted) &&
                    (
                        <textarea name="bio" id="bio"
                            rows={4}
                            required
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder='Provide a short Bio...'
                            className='p-2 border border-gray-500 rounded-md focus:outline-none
                        foucs:ring-2 bg-transparent'>

                        </textarea>
                    )
                }
                <button

                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>

                <div className='flex gap-5 ml-2'>
                    <input type="checkbox" required />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
