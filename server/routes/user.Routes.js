
import express from 'express'
import { acceptingRequest, getAllRequestUser, isAuthUser, login, Register, sendRequest, updateMessageApperence, userUpdate } from '../controller/userController.js'
import { isAuth } from '../middleware/isAuth.js'
import upload from '../utils/Claudinary.js'
const userRouter = express.Router()

userRouter.route("/register")
    .post(Register)

userRouter.route("/login")
    .post(login)


userRouter.route("/isAuth")
    .get(isAuth, isAuthUser)


userRouter.route("/user-update")
    .put(isAuth, userUpdate)

userRouter.route("/sendReuqest/:id")
    .post(isAuth, sendRequest)

userRouter.route("/acceptRequest/:id")
    .post(isAuth, acceptingRequest)

userRouter.route("/get-request/:id")
    .get(getAllRequestUser)

    userRouter.route("/message-appearnce/:id")
    .put(isAuth,updateMessageApperence)




export default userRouter