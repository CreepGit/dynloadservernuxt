import { formValue } from "../plugins/teststate"
import { updateClients } from "../routes/_ws"
import { prismaClient } from "../plugins/prisma"
import { getUser } from "~/server/authenticationHelper"

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    const text = body.value as string
    const user = await getUser(event)

    if (text.length < 4) {
        return createError({statusCode: 400, message: "Text too short"})
    }

    await prismaClient.testformdata.create({
        data: {
            value: text,
            byUser: user?.id ? {
                connect: {
                    id: user.id,
                }
            } : undefined
        }
    })
    formValue.value = text
    console.log("📋 Created database entry " + (user?.id ? "connected to " + user.id : ""))
    
    updateClients("/api/testform", "/api/test")
    return { message: "ok" }
})