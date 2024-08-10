export const useWsStore = defineStore("wsStore", ()=>{
    const conn = ref<WebSocket | null>(null)
    const status = ref("unopened")
    const reconnectTimeout = ref<NodeJS.Timeout | undefined>(undefined)
    const trackForRefres = ref<any>({})
    const updateCounter = ref(0)

    function connectWS() {
        const ws = new WebSocket("/_ws")
        ws.onopen = () => {
            console.log("WebSocket connection established.")
            status.value = "open"
        }
        ws.onclose = () => {
            status.value = "closed"
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(`Got message`, data)
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
