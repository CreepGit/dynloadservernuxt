import { value } from "@/server/plugins/teststate"
import { prismaClient } from "../plugins/prisma"

// nuxt server/api/test.get.ts
export default defineEventHandler(async (e)=>{
    const oldForms = await prismaClient.testformdata.findMany({take: 5, orderBy: {id: "desc"}, include: {byUser: true}})
    const ownerString = (form: any) => form.byUser ? ` by ${form.byUser.username}` : ""
    const oldFormsString = oldForms.reverse().map((form)=>`${form.id}. ${form.value}${ownerString(form)}`).join(",\n")
    return {message: `Hello from the server! ${value.value}\n${oldFormsString}`}
})
