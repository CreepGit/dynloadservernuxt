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
