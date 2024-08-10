import bcrypt from 'bcrypt';
import { prismaClient } from '../plugins/prisma';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const { username, password } = body
   
    const user = await prismaClient.user.findFirst({where: {username: username}})
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw createError({ statusCode: 404, statusMessage: 'Invalid username or password' });
    }

    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET not found')
    }
    const token = jwt.sign({ username: username, }, JWT_SECRET, { expiresIn: '3h' })

    return {message: "login good", token: token}
})
