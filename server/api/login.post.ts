import bcrypt from 'bcrypt';
import { prismaClient } from '../plugins/prisma';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const { username, password } = body
   
    const user = await prismaClient.user.findFirst({where: {username: username}})
    if (!user) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Username or password incorrect' })
        };
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Username or password incorrect' })
        };
    }

    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET not found')
    }
    const token = jwt.sign({ username: username, }, JWT_SECRET, { expiresIn: '1h' })

    return {message: "login good", token: token}
})
