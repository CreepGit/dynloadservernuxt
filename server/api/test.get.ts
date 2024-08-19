import { value } from "@/server/plugins/teststate"
import { prismaClient } from "../plugins/prisma"
import { getUser } from "~/server/authenticationHelper"

// nuxt server/api/test.get.ts
export default defineEventHandler(async (event)=>{
    const user = await getUser(event)
    if (user) {
        return {message: `Hello ${user.username}! ${value.value}`}
    }
    return {message: `Hello from the server! ${value.value}`}
})
