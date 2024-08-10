import { isAuthenticated } from "../serverAuth"
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event)=> {
    const auth = await isAuthenticated(event)
    let username = ''
    if (auth) {
        username = auth
    }
    return { username: username, isAuth: !!auth }
})
