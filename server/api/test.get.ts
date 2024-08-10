import { value } from "@/server/plugins/teststate"
import { prismaClient } from "../plugins/prisma"
import { isAuthenticated } from "../serverAuth"

// nuxt server/api/test.get.ts
export default defineEventHandler(async (e)=>{
    const isAuth = await isAuthenticated(e)
    const oldForms = await prismaClient.testformdata.findMany({take: 5, orderBy: {id: "desc"}})
    const oldFormsString = oldForms.reverse().map((form)=>`${form.id}. ${form.value}`).join(",\n")
    return {
        message: `Hello from the server! ${value.value}\n${oldFormsString}`,
        authStatus: isAuth,
    }
})
