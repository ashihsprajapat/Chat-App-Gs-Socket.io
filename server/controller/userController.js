
import { User } from "../model/user.js";
import bcrypt from 'bcrypt'
import { tokenGenerator } from "../utils/tokenGenerate.js";
import cloudinary from "../utils/Claudinary.js";

import { io, userSocketMap } from "../server.js";

//user register function
export const Register = async (req, res) => {
    const { name, email, password, bio } = req.body;


    try {

        if (!name || !email || !password || !bio)
            return res.status(500).json({ message: "All detaul are requried", success: false })

        const user = await User.findOne({ email }).select("-password")

        if (user)
            return res.json({ message: "email all ready exist", success: false })

        //hashpassword
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name, email, password: hashPassword, bio
        })

        await newUser.save()

        const token = tokenGenerator(newUser._id)

        res.json({ message: "user register successFull", user: newUser, success: true, token })
    } catch (err) {
        console.log(err)
        res.json({ message: err.message, success: true })
    }

}

//user login function
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.json({ message: "all Details are required", success: false })

    try {
        const user = await User.findOne({ email })

        if (!user)
            return res.json({ message: "User not found", success: false })

        let match = await bcrypt.compare(password, user.password)

        if (!match)
            return res.json({ message: "Wrong password", success: false })

        const token = tokenGenerator(user._id)

        res.json({ message: "Login successfully", user, success: true, token })

    }
    catch (err) {
        console.log(err)
        res.json({ message: err.message, success: false })
    }
}

//chech user authenticate or not
export const isAuthUser = async (req, res) => {
    try {
        res.json({ success: true, user: req.user, message: "authenticate user" })

    } catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })
    }
}

//user profile chech
export const userUpdate = async (req, res) => {

    try {
        const { bio, profilePic, name } = req.body

        const userId = req.user._id;

        let updateUser;

        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(userId, { bio, name }, { new: true })
        } else {
            const upload = await cloudinary.uploader.upload(profilePic)

            updateUser = await User.findByIdAndUpdate(userId, { bio, name, profilePic: upload.secure_url }, { new: true })
        }

        res.json({ success: true, message: "user update", user: updateUser })

    } catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })

    }


}


// send request for accepting in connections 
export const sendRequest = async (req, res) => {

    try {

        const user = req.user

        const { id: selectedUserId } = req.params;

        const selectedUser = await User.findById(selectedUserId).select("-password")

        const allReadySendReq = Array.isArray(selectedUser.requests) && selectedUser.requests.length > 0
            ? selectedUser.requests.some((userId) => userId.toString() === user._id.toString())
            : false;

        if (!allReadySendReq) {

            selectedUser.requests.push(user._id)
            await selectedUser.save()


            const socketId = userSocketMap[selectedUserId];
            if (socketId) {

                io.to(socketId).emit("sendRequest", {
                    from: user._id,
                    requests: selectedUser.requests
                })
            }

            res.json({ message: "request sending", success: true })
        } else {
            res.json({ message: "already  request sended", success: true })

        }



    } catch (err) {
        console.log(err.message)
        res.json({ message: err.message, success: false })
    }
}


//accepte request for getting request 
export const acceptingRequest = async (req, res) => {
    try {

        const user = req.user

        const { id: reqUserId } = req.params;

        const reqUser = await User.findById(reqUserId).select('-password')

        const { accept } = req.body;

        if (accept) {

            const userConnections = new Map(user.connections)
            userConnections.set(reqUserId, "7".toString())
            const requserConntions = new Map(reqUser.connections)
            requserConntions.set(user._id, "7")


            await User.findByIdAndUpdate(user._id, { connections: userConnections })
            await User.findByIdAndUpdate(reqUserId, { connections: requserConntions })




        }

        const socketId = userSocketMap[reqUserId];
        if (socketId) {
            io.to(socketId).emit("acceptRequest", {
                user: user,
                accepted: accept
            });
        }

        user.requests = user.requests.filter((id) => id.toString() !== reqUserId);

        await user.save()

        res.json({ message: `req is ${accept}`, success: true })

    } catch (err) {
        console.log("err occur in accepting request", err)
        res.json({ messagae: err.messagae, success: false })
    }
}


//get all request users 
export const getAllRequestUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id).populate("requests").select("-password")

        //console.log(user)
        res.json({ message: 'all request users', allRequestUsers: user.requests, success: true })

    } catch (err) {
        console.log(err.messagae)
        res.json({ message: err.messagae, success: false })
    }
}


//update message appearnce  in connections 
export const updateMessageApperence = async (req, res) => {
    try {
        const user = req.user
        const { id } = req.params
        const { appearence } = req.body

        const connections = new Map(user.connections)
        connections.set(id, appearence.toString())

        await User.findByIdAndUpdate(user._id, connections)

        res.json({ success: true, message: "messagae appearence update" })

    } catch (err) {
        console.log(err.messagae)
        res.json({ success: false, messagae: err.messagae })
    }
}


export const updateConnectionDate = async (req, res) => {
    try {


        const { user } = req;
        const { id: selectedId } = req.params;
        const days = req.body.days;
        const connections = new Map(user.connections);
        connections.set(selectedId, days.toString())

        await user.findByIdAndUpdate(user._id, { connections: connections })

        console.log("user connection is updaet", user.connections)

        res.send({ message: "connection date update", success: true, user })

    }
    catch (err) {
        console.log(err.message)
        res.json({ success: false, messagae: err.messagae })
    }

}