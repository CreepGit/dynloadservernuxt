import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prismaClient } from "~/server/plugins/prisma"
import { secretKey } from "~/server/api/auth/register.post"
import { userValid } from "~/assets/zods"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parse = userValid.safeParse(body)
    if (parse.success == false) {
        return createError({ status: 400, statusMessage: "Didn't pass validation" })
    }
    const username = parse.data.username
    const foundUser = await prismaClient.user.findFirst({ where: { username } })
    if (!foundUser) {
        return createError({ status: 400, statusMessage: "Not found user" })
    }
    const validPassword = await bcrypt.compare(parse.data.password, foundUser.password)
    if (!validPassword) {
        return createError({ status: 400, statusMessage: "Invalid password" })
    }
    const token = jwt.sign({ username: foundUser.username, type: 'token' }, secretKey)
    const refreshToken = jwt.sign({ username: foundUser.username, type: 'refresh' }, secretKey)
    return { token, refreshToken }
})