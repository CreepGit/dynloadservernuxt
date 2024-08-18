import { formValue } from "../plugins/teststate"
import { updateClients } from "../routes/_ws"
import { prismaClient } from "../plugins/prisma"
import { getPayload } from "~/server/authenticationHelper"

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    formValue.value = body.value

    const userPayload = await getPayload(event)
    let userId;
    if (userPayload) {
        const dbUser = await prismaClient.user.findFirst({where: {username: userPayload.username}})
        if (dbUser) {
            userId = dbUser.id
        }
    }

    await prismaClient.testformdata.create({
        data: {
            value: body.value,
            byUser: userId ? {
                connect: {
                    id: userId,
                }
            } : undefined
        }
    })
    console.log("📋 Created database entry ", userId ? "connected to " + userId : "")
    
    updateClients("/api/testform", "/api/test")
    return { message: "ok" }
})