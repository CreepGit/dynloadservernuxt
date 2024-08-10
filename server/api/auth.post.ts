import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const { token } = body
    
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET not found')
    }
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET)
    } catch (e) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }

    const username = (payload as any)?.username || 'Username Lost'
    return { message: 'Token verified', payload: payload, username: username}
})
