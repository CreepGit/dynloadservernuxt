import { AuthStatus, JWT_SECRET, JWTPayload } from "~/server/authenticationHelper"
import jwt from 'jsonwebtoken'

export default eventHandler(async (event) => {
    const token = getCookie(event, "authToken")
    if (!token) {
        return createError({ statusCode: 401, statusMessage: "No auth token" })
    }
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    if (!payload) {
        return createError({ statusCode: 401, statusMessage: "Invalid token" })
    }
    const nowTime = Math.floor(Date.now() / 1000)
    const remainingSeconds = payload.exp - nowTime
    if (remainingSeconds < 0) {
        return createError({ statusCode: 401, statusMessage: "Token expired" })
    }
    if (remainingSeconds < 10 * 60) {
        const newToken = jwt.sign({ username: payload.username } as JWTPayload, JWT_SECRET, { expiresIn: '2h' })
        return { token: newToken } as AuthStatus
    }
    return { token } as AuthStatus
})