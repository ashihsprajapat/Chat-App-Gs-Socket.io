
import express from "express"
import { isAuth } from "../middleware/isAuth.js"
import { getMessage, getUsersForSidebar, markMessageAsSeen } from "../controller/message.controller.js"
const messageRouter = express.Router()

messageRouter.route("/getUsersForSidebar")
    .get(isAuth, getUsersForSidebar)

messageRouter.route("/:id")
    .get(isAuth, getMessage)


messageRouter.route("/mark/:id")
    .put(isAuth, markMessageAsSeen)



export default messageRouter