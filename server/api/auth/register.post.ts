import { prismaClient } from "~/server/plugins/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userValid } from "~/assets/zods"

export const secretKey = 'superSecret'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parse = userValid.safeParse(body)
    if (parse.success == false) {
        return createError({ status: 400, statusMessage: "Didn't pass validation" })
    }
    const username = parse.data.username
    const password = await bcrypt.hash(parse.data.password, 10)
    const foundUser = await prismaClient.user.findFirst({ where: { username } })
    if (foundUser) {
        return createError({ status: 400, statusMessage: "Username already exists" })
    }
    const user = await prismaClient.user.create({ data: { username, password } })
    const token = jwt.sign({ username: user.username }, secretKey)
    return { token }
})
