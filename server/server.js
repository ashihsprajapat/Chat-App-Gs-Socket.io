

import express from 'express'
import dotenv from "dotenv"
import http from 'http'
import cors from "cors"
import mongoose from 'mongoose'
import { Server } from 'socket.io'

import { User } from './model/user.js'
import { Message } from './model/messag.js'

import { main } from './utils/DBConnection.js'

import userRouter from './routes/user.Routes.js'

import messageRouter from './routes/message.routes.js'


const port = process.env.PORT || 5059

const app = express();

const server = http.createServer(app);



app.use(express.json({ limit: "4mb" }))
app.use(cors())


app.use("/api/status", (req, res) => {
    res.send("server is live")
})

server.listen(port, () => {
    console.log("server is running on port", port)
})


//connect to server
main()
    .catch(err => console.log(err));



app.use("/api/user", userRouter)

app.use("/api/message", messageRouter)