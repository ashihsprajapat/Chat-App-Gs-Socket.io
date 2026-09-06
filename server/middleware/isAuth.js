
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import { User } from "../model/user.js";
import { cacheUser, getCachedUser } from "../utils/redis.js";
export const isAuth = async (req, res, next) => {

    try {
        const token = req.headers.chat_app_gs_token
      

        if (!token)
            return res.json({ message: "token required", success: false })

        let decoded = await jwt.verify(token, process.env.JWTSCRET);

        const userId = decoded.id;

        let user = await getCachedUser({ id: userId });
        if (!user) {
            user = await User.findById(userId).select("-password");
            await cacheUser(user);
        }

        if (!user)
            return res.json({ success: false, message: "Not authenticate" })

        // Redis stores JSON, so restore MongoDB's Map field for controllers
        // that use connections.has() and connections.get().
        if (!(user.connections instanceof Map)) {
            user.connections = new Map(Object.entries(user.connections || {}));
        }

        req.user = user;
        next()
    } catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })
    }


}
