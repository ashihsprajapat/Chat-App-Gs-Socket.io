import { Message } from "../model/messag.js";
import { User } from "../model/user.js";
import cloudinary from "../utils/Claudinary.js";

import { io, userSocketMap } from "../server.js";


//get all users for sidebar
export const getUsersForSidebar = async (req, res) => {
    try {

        const userId = req.user._id;

        const filterUser = await User.find({ _id: { $ne: userId } }).select("-password")

        let unSeenMessageCount = await Message.find({ reciever: userId, seen: false })

        let unSeenMessage = {}

        let promises = filterUser.map(async (user, id) => {
            let allMessage = await Message.find({ senderId: user._d, recieverId: userId, seen: false })
            if (allMessage.length > 0)
                unSeenMessage[user._id] = allMessage.length;
            return
        })

        await Promise.all(promises)

        res.json({
            users: filterUser, unSeenMessage, message: "find all user success", success: true,
            allUnseenMessageCount: unSeenMessageCount,
        })

    } catch (err) {
        console.log(err.message)
        res.json({ message: err.message, success: false })
    }

}

//get all messsage  message selected user
export const getMessage = async (req, res) => {
    try {

        const userId = req.user._id
        const user = req.user
        const { id: selectedUserId } = req.params;

        if (!selectedUserId)
            return res.json({ success: false, message: "selected user required" })

        const has = user.connections.has(selectedUserId)

        if (!has) {
            return res.json({ messagae: "this is not in your connections", success: false, notInConnection: true })
        }

        const days = user.connections.get(selectedUserId)

        const beforeDateMessage = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);


        // console.log(userId, selectedUserId)

        const message = await Message.find({
            $or: [
                { sender: userId, reciever: selectedUserId }
                , { sender: selectedUserId, reciever: userId }
            ],
        

        })

        const now = Date.now();



        await Message.updateMany({ sender: selectedUserId, reciever: userId }, { seen: true })

        res.json({ success: true, message })

    } catch (err) {
        console.log(err)
        res.json({ message: err.message, success: false })
    }

}


//make to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params

        await Message.findByIdAndUpdate(id, { seen: true })

        res.json({ success: true })
    } catch (err) {
        res.json({ message: err.message, success: false })
    }
}

//send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const sender = req.user._id
        const { id: reciever } = req.params
        const { text, image, images = [] } = req.body
        const imageInputs = Array.isArray(images) ? images : []
        if (image && !imageInputs.includes(image)) imageInputs.push(image)

        const imageUploads = await Promise.all(
            imageInputs.filter(Boolean).map((source) => cloudinary.uploader.upload(source, {
                folder: "chat-app/messages",
                resource_type: "image",
            }))
        )
        const imageUrls = imageUploads.map((upload) => upload.secure_url)

        let newMessage = new Message({
            sender,
            reciever,
            image: imageUrls[0] || undefined,
            images: imageUrls,
            text,
        })

        await newMessage.save()

        //Emit the new message to the recever's socket
        const recieverSocketId = userSocketMap[reciever]
        if (reciever) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.json({ message: "message send", success: true, newMessage })
    } catch (err) {
        res.json({ message: err.message, success: false })
    }
}
