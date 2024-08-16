import jwt from "jsonwebtoken"
import { secretKey } from "~/server/api/auth/register.post"

export default defineEventHandler(async (event)=> {
    const body = await readBody(event) as any
    // const token: string = body.token
    const refreshToken: string = body.refreshToken
    if (!refreshToken) {
        return createError({status: 400, statusMessage: "No refresh token"})
    }
    const decoded = jwt.verify(refreshToken, secretKey) as any
    const username = decoded.username
    if (!username) {
        return createError({status: 400, statusMessage: "No username"})
    }
    return { token: jwt.sign({ username, type: 'token' }, secretKey) }
})