import { ref } from "vue"
import { updateClients } from "@/server/routes/_ws"

export const value = ref(0)
export const formValue = ref("Default value")

export default defineNitroPlugin((nitroApp) => {
    console.log("Plugin loaded")

    setInterval(()=>{
        value.value++
        updateClients("/api/test")
    }, 5000)
})

