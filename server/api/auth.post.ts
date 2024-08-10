import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const { token } = body
    
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET not found')
    }
    const payload = jwt.verify(token, JWT_SECRET)

    return { message: 'Token verified', payload: payload }
})
