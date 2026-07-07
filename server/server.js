

import express from 'express'
import http from 'http'
import cors from "cors"
import { Server } from 'socket.io'


import { main } from './utils/DBConnection.js'

import userRouter from './routes/user.Routes.js'

import messageRouter from './routes/message.routes.js'

const app = express();

const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

//store online user
export const userSocketMap = {} //{userId:socketId}

//Socket.io connection handler
io.on("connection", socket => {
    const userId = socket.handshake.query.userId
    console.log("user connected", userId)

    if (userId)
        userSocketMap[userId] = socket.id

    //emit online user to all connected cliend
    io.emit("getOnlineUsers", Object.keys(userSocketMap))  //its return only key as userId not send with value of socket.id

    socket.on("disconnect", () => {
        console.log("Disconnect user", userId)

        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

    // this for video call 
    //from here handle calling featuer in backend 
    socket.on('initiateCall', ({ userId, signalData, myData }) => {
        console.log("req comming for video calling",userId, signalData, myData)
        io.to(userId).emit('incomingCall', { signalData, from: myData._id, myData });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on('endCall', ({ to }) => {
        io.to(to).emit('callEnded');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

})

//Middleware setUp function cors and express json
app.use(express.json())
app.use(express.urlencoded({ extended: true })); //{ limit: "4mb" }
app.use(cors())


app.use("/api/status", (req, res) => {
    res.send("server is live")
})

if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5059
    server.listen(port, () => {
        console.log("server is running on port", port)
    })
}


//connect to server
main()
    .catch(err => console.log(err));



app.use("/api/user", userRouter)

app.use("/api/message", messageRouter)


//export server for vercel
export default server
