import { userValid } from "~/server/api/auth/register.post"
import { prismaClient } from "~/server/plugins/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { secretKey } from "~/server/api/auth/register.post"
export default defineEventHandler(async (event)=> {
    return true
})
