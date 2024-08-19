import { ref } from "vue"
import { updateClients } from "@/server/routes/_ws"
import { prismaClient } from "./prisma"

export const value = ref(0)
export const formValue = ref("(this should not be visible ever)")

prismaClient.testformdata.findFirst({orderBy: {id: "desc"}}).then((latestForm)=>{
    formValue.value = latestForm?.value || "Default value"
})

export default defineNitroPlugin((nitroApp) => {
    console.log("Plugin loaded")

    setInterval(()=>{
        if (Math.random() < 0.2) {
            value.value++
            updateClients("/api/test")
        }
    }, 1000)
})

