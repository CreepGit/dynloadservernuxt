import { formValue } from "@/server/plugins/teststate"
import { getUser } from "~/server/authenticationHelper"
import { prismaClient } from "~/server/plugins/prisma"

export default defineEventHandler(async (event) => {
    const user = await getUser(event)
    let amount = 5;
    if (user) amount = 10;
    const oldMessages = (await prismaClient.testformdata.findMany({ take: amount, orderBy: { id: "desc" }, include: { byUser: true } }))?.reverse().map((entry) => {
        return { message: `${entry.id}: ${entry.value}`, by: entry.byUser?.username }
    })
    return { message: formValue.value, oldMessages: oldMessages }
})
