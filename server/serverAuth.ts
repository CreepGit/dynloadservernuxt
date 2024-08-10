import jwt from 'jsonwebtoken';

export async function isAuthenticated(e: any): Promise<string | null> {
    const cookies = parseCookies(e)
    const authToken = cookies["authToken"]

    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error('JWT_SECRET not found')
    }

    try {
        const payload = jwt.verify(authToken, secret)
        return (payload as any)?.username || 'Failed to get username'
    } catch (e) {
        return null
    }
}