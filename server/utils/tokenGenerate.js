
import jwt from "jsonwebtoken"

export const tokenGenerator = (id) => {
    const token = jwt.sign({ id },process.env.JWTSCRET, { expiresIn: '7D' })

    return token
}