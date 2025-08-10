import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext()

const backendUrl = import.meta.env.VITE_BACKEND_URL
export const ChatProvider = ({ children }) => {

    const { axios,
        authUser,
        onlineUser,
        socket, setOnlineUser } = useContext(AuthContext)

    const [sideBarUsers, setSideBarUsers] = useState([])
    const [message, setMessage] = useState([])
    const [onlineusers, setOnlineUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessage, setUnseenMessage] = useState({}) // {userId: unseenmessage}
    const [selectedUserData, setSelectedUserdata] = useState(null)

    const [skeleton, setSkeleton] = useState(false)

    const [reqSend, setReqSend] = useState(null)

    const [newReq, setNewRequest] = useState(null)

    const [setting, setSetting] = useState(null)


    //function to get all users for sidebar
    const getSideBarUser = async () => {
        try {

            const { data } = await axios.get('/api/message/getUsersForSidebar')
            // console.log(data)
            if (data.success) {
                setSideBarUsers(data.users)
                setUnseenMessage(data.unSeenMessage)
            }
            else
                toast.error(data.message)

        } catch (e) {
            console.log(e.message)
            toast.error(e.message)
        }
    }

    //function to get message for  Selected  users
    const getMessageSelectedUser = async (userId) => {
        try {
            setMessage([])
            setSkeleton(true)

            const { data } = await axios.get(`/api/message/${userId}`)

            if (data.success) {
                setSkeleton(false)

                setMessage(data.message)
                setReqSend(null)
            }

            if (data.notInConnection) {
                setReqSend(userId)
            }

        } catch (e) {
            toast.success(e.message)
        }
    }

    //function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/message/send/${selectedUser._id}`, messageData)
            console.log("res for messsge sending", data)
            if (data.success) {
                setMessage((prev) => ([...prev, data.newMessage]))
                getMessageSelectedUser(selectedUser._id);
            } else
                toast.error(data.message)

        } catch (e) {
            toast.error(e.message)
        }

    }

    //function to subscribe to message for selected user
    const subscribeToMessage = async (messageId) => {
        if (!socket)
            return

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.sender === selectedUser._id) {
                newMessage.seen = true
                setMessage(prev => [...prev, newMessage])
                axios.put(`/api/message//mark/${newMessage._id}`)

            } else {
                setUnseenMessage((prev) =>
                ({
                    ...prev,
                    [newMessage.sender]: prev[newMessage.sender] ? prev[newMessage.sender] + 1 : 1
                }))
            }
        })

        socket.on("acceptRequest", (user) => {
            console.log("req come for acceptReuest", user)
            toast.success("request accepted")
        })

        socket.on("sendRequest", (user) => {
            console.log("req come for sendReuest", user)
            setNewRequest(user)
        })
    }

    //function to unsubscribe from message
    const unsubscribeFromMessage = async () => {
        if (socket)
            socket.off("newMessage")
    }


    //send request to selected user if not in connections
    const sendRequest = async (userId) => {
        try {

            const { data } = await axios.post(`/api/user/sendReuqest/${userId}`)
            console.log("res ponse after sending data", data)
            if (data.success) {
                toast.success("req sending to user")
            }
            else {
                toast.error(data.message)
            }

        } catch (err) {

        }
    }


    //accept request  from 
    const acceptRequest = async (accept, id) => {
        try {

            const { data } = await axios.post(`/api/user/acceptRequest/${id}`, { accept })
            console.log("req accept response is ", data)

            if (data.success) {
                //toast.success("req accepted")
            } else {
                toast.error(data.message)
            }

        } catch (err) {

        }
    }


    // update all message appearence and clear chat
    const messageAppearence = async (appearence) => {
        try {
            const { data } = await axios.put(`/api/user/message-appearnce/${selectedUser._id}`, { appearence })
            console.log("response for message appearence ")


            if (data.success) {
                setSetting(null)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (err) {

        }
    }





    useEffect(() => {
        subscribeToMessage()
        return () => unsubscribeFromMessage()
    }, [socket, selectedUser, setSelectedUser])



    const value = {
        getSideBarUser,
        sideBarUsers,
        selectedUser, setSelectedUser,
        message, setMessage,
        sendMessage,
        unseenMessage, setUnseenMessage,
        getMessageSelectedUser,
        reqSend, setReqSend,
        sendRequest,
        acceptRequest,
        setting, setSetting,
        skeleton, setSkeleton

    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}