export const useWsStore = defineStore("wsStore", ()=>{
    const conn = ref<WebSocket | null>(null)
    const status = ref<"unopened"|"open"|"closed">("unopened")
    const reconnectTimeout = ref<NodeJS.Timeout | undefined>(undefined)
    const trackForRefres = ref<any>({})
    const updateCounter = ref(0)

    function connectWS() {
        const toast = useToast()
        const ws = new WebSocket("/_ws")
        ws.onopen = () => {
            console.log("WebSocket connection established.")
            status.value = "open"
            toast.add({summary: "WebSocket Connected", detail: "The WebSocket connection has been established.", severity: "success", life: 5000,})
        }
        ws.onclose = () => {
            status.value = "closed"
            toast.add({summary: "WebSocket Disconnected", detail: "The WebSocket connection lost.", severity: "error", life: 15000 })
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if (data.type === "update") {
                const callback = trackForRefres.value[data.target]
                if (callback) {
                    callback()
                    updateCounter.value = updateCounter.value + 1
                }
            }
        }
        conn.value = ws
    }

    if (process.client) {
        connectWS()
        if (reconnectTimeout.value === undefined) {
            reconnectTimeout.value = setInterval(()=>{
                if (status.value === "closed") {
                    connectWS()
                }
            }, 5000)
        }
    }

    function addTrack(url: string, callback: ()=>void) {
        trackForRefres.value[url] = callback
    }

    const trackList = computed(()=>{
        return Object.keys(trackForRefres.value)
    })

    return { conn, status, addTrack, trackList, updateCounter }
})
