
import express from "express"
import { isAuth } from "../middleware/isAuth.js"
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controller/message.controller.js"
const messageRouter = express.Router()

messageRouter.route("/getUsersForSidebar")
    .get(isAuth, getUsersForSidebar)

messageRouter.route("/:id")
    .get(isAuth, getMessage)


messageRouter.route("/mark/:id")
    .put(isAuth, markMessageAsSeen)

messageRouter.route("/send/:id")
    .post(isAuth, sendMessage)



export default messageRouter