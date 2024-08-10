import { value } from "@/server/plugins/teststate"

// nuxt server/api/test.get.ts
export default defineEventHandler(async (e)=>{
    console.log("Server side log", e.node.req.url)
    return {message: `Hello from the server! ${value.value}`}
})
