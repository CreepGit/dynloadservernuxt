import bcrypt from 'bcrypt';
import { prismaClient } from '@/server/plugins/prisma';

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const { username, password } = body
    
    const foundUser = await prismaClient.user.findFirst({where: {username: username}})
    if (foundUser) {
        throw createError({ statusCode: 409, statusMessage: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prismaClient.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    })

    return { message: 'User created' }
})
