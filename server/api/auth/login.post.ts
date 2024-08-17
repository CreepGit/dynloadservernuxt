import { UserValid } from "~/assets/zods"
import { prismaClient } from "~/server/plugins/prisma"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AuthStatus, JWT_SECRET, JWTPayload } from "~/server/authenticationHelper"

export default eventHandler(async (event) => {
    const body = await readBody(event)
    const { success, data, error: zError } = UserValid.safeParse(body)
    if (!success) {
        const errorMsg = zError.errors.map(e => e.message).join(", ")
        return createError({statusCode: 400, statusMessage: errorMsg})
    }
    const dbUser = await prismaClient.user.findFirst({where: {username: data.username}})
    if (!dbUser) {
        return createError({statusCode: 401, statusMessage: "No user with that name"})
    }
    const isPasswordGood = await bcrypt.compare(data.password, dbUser.password)
    if (!isPasswordGood) {
        return createError({statusCode: 401, statusMessage: "Invalid password"})
    }
    const token = jwt.sign({username: data.username} as JWTPayload, JWT_SECRET, {expiresIn: '2h'})
    return { token } as AuthStatus
})