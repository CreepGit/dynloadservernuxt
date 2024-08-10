import { formValue } from "../plugins/teststate"
import { clients } from "../routes/_ws"

export default defineEventHandler(async (event)=> {
    const body = await readBody(event)
    formValue.value = body.value
    for (const id in clients) {
        clients[id].send({
            type: "update",
            target: "/api/testform"
        })
    }
    return { message: "ok" }
})