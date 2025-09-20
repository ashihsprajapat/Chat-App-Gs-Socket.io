import { useState, createContext, useEffect, } from "react"

const backendUrl = import.meta.env.VITE_BACKEND_URL

import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthPorvider = ({ children }) => {

    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(null)
    const [onlineUser, setOnlineUser] = useState([])
    const [token, setToken] = useState(localStorage.getItem("chat_app_GS_Token"))
    const [socket, setSocket] = useState(null)

    const [mode, setMode]= useState("dark");


    const [isLoading, setIsLoading] = useState(false);

    //check if user is authenticate or not  set the user data and connect the scoket

    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/user/isAuth', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    token
                }
            })
            console.log(data)
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            } else {
                toast.error(data.message)
            }

            io

        } catch (e) {
            console.log(e)
            toast.error(e.message)
        }

    }


    //login functio handle user authentication and socket connection
    const login = async (state, credentials) => { //in this state can be login or register
        //credentials are body for login and register
        try {

            setIsLoading(true)
            const { data } = await axios.post(`/api/user/${state}`, credentials)


            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
                axios.defaults.headers.common["token"] = data.token
                setToken(data.token)
                localStorage.setItem("chat_app_GS_Token", data.token)
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

            setIsLoading(false)
        } catch (err) {
            toast.error(err.message)
        }
    }


    //logout function to handle user logout ans socket. disconnect
    const logout = async () => {
        try {
            localStorage.removeItem("chat_app_GS_Token")
            toast.success("logout successfull")
            setToken(null)
            setAuthUser(null)
            setOnlineUser([])
            axios.defaults.headers.common["chat_app_GS_Token"] = null
            socket.disconnect()


        } catch (err) {
            toast.error(err.message)

        }
    }

    //updateProfile function to handle user profile update
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/user/user-update", body)
            if (data.success) {
                toast.success(data.message)
                setAuthUser(data.user)

            }
            else
                toast.error(data.message)

        } catch (err) {
            toast.error(err.message)
        }
    }

    //update user connetions data
    const updateUserConnections = async (days, id) => {
        try {

            const {data}= await axios.post(`/api/user//update-connection/${id}`, {days})
            console.log("changing day of selected user", data)
            if(data.success){
                toast.success(data.message)
                setAuthUser(data.user)

            }

        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    //connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected)
            return

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        })

        newSocket.connect()

        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUser(userIds)
        })

    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["chat_app_GS_Token"] = token
            checkAuth()
        }


    }, [])



    const value = {
        axios,
        authUser,
        onlineUser, setOnlineUser,
        socket,
        login,
        updateProfile,
        logout,
        navigate,
        isLoading, setIsLoading,
        token, setToken,
        updateUserConnections,
        mode, setMode
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}