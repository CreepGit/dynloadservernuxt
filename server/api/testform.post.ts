import { formValue } from "../plugins/teststate"
import { updateClients } from "../routes/_ws"
import { prismaClient } from "../plugins/prisma"

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    formValue.value = body.value
    updateClients("/api/testform", "/api/test")

    await prismaClient.testformdata.create({
        data: {
            value: body.value,
        }
    })
    console.log("📋 Created database entry")

    return { message: "ok" }
})