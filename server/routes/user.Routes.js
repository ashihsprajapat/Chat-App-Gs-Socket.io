
import express from 'express'
import { isAuthUser, login, Register, userUpdate } from '../controller/userController.js'
import { isAuth } from '../middleware/isAuth.js'
const userRouter = express.Router()

userRouter.route("/register")
    .post(Register)

userRouter.route("/login")
    .post(login)


userRouter.route("/isAuth")
    .get(isAuth,  isAuthUser)

userRouter.route("/user-update")
    .put( isAuth, userUpdate)

export default userRouter