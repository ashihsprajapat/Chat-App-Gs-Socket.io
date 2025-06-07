
import { User } from "../model/user";
import bcrypt from 'bcrypt'
import { tokenGenerator } from "../utils/tokenGenerate.js";


export const Register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(500).json({ message: "All detaul are requried", success: false })

    try {



        const user = await User.findOne({ email })
        if (user)
            return res.status(500).json({ message: "email all ready exist", success: false })

        //hashpassword
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name, email, password: hashPassword
        })

        await newUser.save()

        const token=tokenGenerator(newUser._id)

        res.json({ message: "user register successFull", success: true,token })
    } catch (err) {
        console.log(err)
        res.json({ message: err.message, success: true })
    }

}

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

        const token=tokenGenerator(user._id)

        res.json({ message: "Login successfully", success: true,token })

    }
    catch (err) {
        console.log(err)
        res.json({ message: err.message, success: false })
    }
}