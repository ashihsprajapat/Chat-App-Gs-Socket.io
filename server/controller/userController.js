
import { User } from "../model/user.js";
import bcrypt from 'bcrypt'
import { tokenGenerator } from "../utils/tokenGenerate.js";
import cloudinary from "../utils/Claudinary.js";


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