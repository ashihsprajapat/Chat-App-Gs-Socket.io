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
    const [defaultDays, setDefaultDays] = useState(1)
    console.log("default days is", defaultDays)



    // Skeleton state to show loading state when changing selected user or sending messages
    const [skeleton, setSkeleton] = useState({
        loading: false,
        trigger: null // tracks what triggered the skeleton - 'user' or 'message'
    })

    const [reqSend, setReqSend] = useState(null)

    const [newReq, setNewRequest] = useState(null)

    const [allRequestedUser, setAllRequestedUser] = useState([])
    const [sendingReqLoading, setSendingReqLoading] = useState(false)


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

            if (data.success) {
                setMessage((prev) => ([...prev, data.newMessage]))
                // No need to call getMessageSelectedUser since we already have the new message
                // This prevents triggering skeleton loading when sending messages
            } else {
                toast.error(data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    //function to subscribe to message for selected user
    const subscribeToMessage = async (messageId) => {
        if (!socket)
            return

        socket.emit("join", authUser._id)

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

        socket.on("acceptRequest", (data) => {
            console.log("Received accept request data:", data);
            const { user, accepted } = data;
            toast.success(`Request was ${accepted ? 'accepted' : 'rejected'}`);
            if (user && user._id && accepted !== undefined) {
                getMessageSelectedUser(user._id);
                setReqSend(false);

            } else {
                console.error("Invalid user data received in acceptRequest");
            }
        })

        socket.on("sendRequest", (user) => {
            console.log("req come for sendReuest socket.io tirgger", user)
            getAllRequestedUsers();
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
            setSendingReqLoading``
            const { data } = await axios.post(`/api/user/sendReuqest/${userId}`)
            console.log("res ponse after sending data", data)
            if (data.success) {
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }
            setSendingReqLoading(false)

        } catch (err) {
            console.log(err)
        }
    }

    //get all request user
    const getAllRequestedUsers = async () => {
        if (!authUser)
            return
        const { data } = await axios.get(`/api/user/get-request/${authUser._id}`)

        if (data.success) {
            setAllRequestedUser(data.allRequestUsers)
        }
    }


    //accept request  from 
    const acceptRequest = async (accept, id) => {
        try {

            const { data } = await axios.post(`/api/user/acceptRequest/${id}`, { accept })
            console.log("req accept response is ", data)

            if (data.success) {

                console.log("again loading request")
                getAllRequestedUsers();

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
        if (authUser)
            getSideBarUser()
    }, [authUser])



    useEffect(() => {
        subscribeToMessage()
        return () => unsubscribeFromMessage()
    }, [socket, selectedUser, setSelectedUser])


    //useeffect when selecteduser is changed then defaultdays is change
    useEffect(() => {
        if (selectedUser && authUser?.connections) {
            // Check if connections is an array and convert to entries for Map
            const connectionsArray = Array.isArray(authUser.connections)
                ? authUser.connections
                : Object.entries(authUser.connections);

            const connections = new Map(connectionsArray);
            const days = connections.get(selectedUser._id);
            if (days) {
                setDefaultDays(days);
            }
        }
    }, [selectedUser, authUser])


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
        skeleton, setSkeleton,
        getAllRequestedUsers,
        allRequestedUser, setAllRequestedUser,
        sendingReqLoading, setSendingReqLoading,
        defaultDays, setDefaultDays

    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}