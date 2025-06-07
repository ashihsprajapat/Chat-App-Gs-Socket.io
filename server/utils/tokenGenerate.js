
import { sign } from "jsonwebtoken"

export const tokenGenerator = (id) => {
    const token = sign({ id }, { expiresIn: '1h' })

    return token
}