import jwt from "jsonwebtoken"
import { useCookie } from "nuxt/app"
import { secretKey } from "~/server/api/auth/register.post"

export default defineEventHandler(async (event)=> {
    const token = getHeader(event, 'Authorization')?.split('Bearer ')[1]
    if (!token) {
        return createError({status: 400, statusMessage: "No token"})
    }
    const unpacked = jwt.verify(token, secretKey) as any
    return { username: unpacked.username }
})