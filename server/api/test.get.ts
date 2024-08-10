import { value } from "@/server/plugins/teststate"
import { prismaClient } from "../plugins/prisma"

// nuxt server/api/test.get.ts
export default defineEventHandler(async (e)=>{
    console.log("Server side log", e.node.req.url)
    const oldForms = await prismaClient.testformdata.findMany({take: 5, orderBy: {id: "desc"}})
    const oldFormsString = oldForms.reverse().map((form)=>`${form.id}. ${form.value}`).join(",\n")
    return {message: `Hello from the server! ${value.value}\n${oldFormsString}`}
})
