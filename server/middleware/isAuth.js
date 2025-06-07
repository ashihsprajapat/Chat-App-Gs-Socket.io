
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import { User } from "../model/user.js";
export const isAuth = async (req, res, next) => {

    try {
        const { token } = req.headers

        if (!token)
            return res.json({ message: "token required", success: false })

        let decoded = await jwt.verify(token, process.env.JWTSCRET);

        const userId = decoded.id;

        const user = await User.findById(userId).select("-password")

        if (!user)
            return res.json({ success: false, message: "Not authenticate" })

        req.user = user;
        next()
    } catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })
    }


}