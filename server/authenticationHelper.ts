import { H3Event } from "h3"
import jwt from "jsonwebtoken"

const defaultSecret = 'supermassivesecret'
export const JWT_SECRET = process.env.JWT_SECRET || defaultSecret

export type AuthStatus = {
    token: string,
}

export type JWTPayload = {
    username: string,
    iat: number,
    exp: number,
}

if (process.dev !== true) {
    if (JWT_SECRET == defaultSecret) {
        console.error("YOU ARE USING THE DEFAULT JWT SECRET. Define JWT_SECRET in your .env file")
    }
}

export async function getPayload(event: H3Event) {
    const token = getCookie(event, "authToken")
    if (!token) {
        return null
    }
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
        return null
    }
}