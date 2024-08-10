import { formValue } from "@/server/plugins/teststate"

// nuxt server/api/test.get.ts
export default defineEventHandler(async (e)=>{
    return {message: formValue.value}
})
