import { PrismaClient } from "@prisma/client"

export const prismaClient = new PrismaClient()

export default defineNitroPlugin((nitroApp) => {
    console.log("Prisma loaded")

    nitroApp.hooks.hook("close", async () => {
        console.log("Disconnecting Prisma safely")
        await prismaClient.$disconnect()
    })
})

