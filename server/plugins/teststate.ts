import { ref } from "vue"
import { clients } from "@/server/routes/_ws"

export const value = ref(0)

export default defineNitroPlugin((nitroApp) => {
    console.log("Plugin loaded")

    setInterval(()=>{
        value.value++
        for (const id in clients) {
            clients[id].send({
                type: "update",
                target: "/api/test"
            })
            console.log("Sent update to", clients[id])
        }
    }, 5000)
})

