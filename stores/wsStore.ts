export const useWsStore = defineStore("wsStore", ()=>{
    const toast = useToast()
    const trackForRefres = ref<any>({}) // TODO make useless and remove

    // region WebSocket
    const conn = ref<WebSocket | null>(null)
    const status = ref<"unopened"|"open"|"closed"|"connecting"|"reconnect">("unopened")
    const unsuccesfulReconnects = ref(0)
    async function connectWS() {
        if (!["unopened", "reconnect"].includes(status.value)) {
            console.warn("🍕🔗 Anomalous attempt to reconnect with '" + status.value + "'.")
        }
        status.value = "connecting"
        await new Promise<void>(async (resolve, reject) => {
            const ws = new WebSocket("/_ws")
            ws.onopen = () => {
                status.value = "open"
                toast.add({summary: "WebSocket Connected", detail: "The WebSocket connection has been established.", severity: "success", life: 5000,})
                console.log("🍕✅ WebSocket connected.")
                conn.value = ws
                resolve()
            }
            ws.onclose = (event) => {
                if (ws != conn.value) {
                    toast.add({summary: "Rogue Socket Killed!", detail: "Rogue connection has been killed.", severity: "warn", life: 2500 })
                    return
                }
                toast.add({summary: "WebSocket Disconnected", detail: "The WebSocket connection lost.", severity: "error", life: 15000 })
                status.value = "closed"
                if (event.code === 1000) return // 1000 indicates a normal closure
                if (event.code === 1001) return // 1001 indicates that an endpoint is "going away", such as a server going down or a browser having navigated away from a page.
                status.value = "reconnect"
                console.log("🍕❌♻️ WebSocket closed with desire to reopen. Code: " + event.code + " Reason: " + event.reason)
            }
            ws.onerror = (event) => {
                console.log("🍕❌ WebSocket error.", event)
                reject()
            }
            ws.onmessage = (e) => {
                if (conn.value != ws) {
                    console.error("🍕❌💀 WebSocket message from rogue connection. Killing rogue!")
                    ws.close()
                }
                reject()
                const data = JSON.parse(e.data) as { type: string, target: string }
                if (data.type === "update") {
                    if (updateInformation.value[data.target] === undefined) {
                        updateInformation.value[data.target] = {lastUpdated: 0, updateCount: 0}
                        // console.log("🍕 Updating immediately for " + data.target + " as it was never updated before.")
                        callUrl(data.target)
                        return
                    }
                    if (updateQueue.value.has(data.target)) {
                        // console.log("🍕 Already waiting for " + data.target + ".")
                        return
                    }
                    const sinceLastUpdate = Date.now() - updateInformation.value[data.target]!.lastUpdated
                    if (sinceLastUpdate < MIN_API_REFRESH_TIME.value) {
                        // console.log("🍕 Adding to queue for " + data.target + " as it was updated " + sinceLastUpdate + "ms ago.")
                        addToQueue(data.target)
                        return
                    } else {
                        let sinceLastUpdateText = sinceLastUpdate.toString()
                        // console.log("🍕 Updating immediately for " + data.target + " as it was updated " + sinceLastUpdateText + "ms ago.")
                        callUrl(data.target)
                    }
                }
            }
        }).then(()=>{
            unsuccesfulReconnects.value = 0
        }).catch(async (error) => {
            status.value = "closed"
            unsuccesfulReconnects.value += 1
            const tried = unsuccesfulReconnects.value
            if (tried < 4) {
                await new Promise(resolve => setTimeout(resolve, 2500))
                status.value = "reconnect"
            } else if (tried < 10) {
                await new Promise(resolve => setTimeout(resolve, 15000))
                status.value = "reconnect"
            } else if (tried < 20) {
                await new Promise(resolve => setTimeout(resolve, 600000))
                status.value = "reconnect"
            } else {
                status.value = "closed"
                console.log("🍕❌🔗 WebSocket reconnect failed after " + tried + " attempts.")
            }
        })
    }

    const reconnectIntervalID = ref<NodeJS.Timeout|undefined>(undefined)
    onMounted(async ()=>{
        await connectWS()
        if (reconnectIntervalID.value === undefined) {
            console.log("♻️ Starting reconnect interval.")
            reconnectIntervalID.value = setInterval(async ()=>{
                if (status.value === "reconnect") {
                    console.log("🍕♻️ Attempting to reconnect WebSocket.")
                    await connectWS()
                }
            }, 500)
        }
    })
    // endregion

    // region API Queue
    const updateInformation = ref<Partial<Record<string, {lastUpdated: number, updateCount: number}>>>({})
    const updateQueue = ref<Set<string>>(new Set())
    const MIN_API_REFRESH_TIME = computed(()=>{
        if (activityName.value == "active") return 3000
        if (activityName.value == "slow") return 20000
        if (activityName.value == "inactive") return 60000
        console.error("❌🍕 MIN_API_REFRESH_TIME is not defined for " + activityName.value)
        return 3000
    })
    const updateCounter = computed(()=>{
        let num = 0
        for (const [url, data] of Object.entries(updateInformation.value)) {
            num += data!.updateCount
        }
        return num
    })

    function addToQueue(url: string) {
        if (updateInformation.value[url] === undefined) {
            updateInformation.value[url] = {lastUpdated: 0, updateCount: 0}
        }
        if (updateQueue.value.has(url)) return
        updateQueue.value.add(url)
    }

    function callUrl(url: string) {
        const callback = trackForRefres.value[url]
        if (updateInformation.value[url] === undefined) {
            updateInformation.value[url] = {lastUpdated: 0, updateCount: 0}
        }
        updateInformation.value[url].lastUpdated = Date.now()
        if (callback) {
            updateQueue.value.delete(url)
            callback()
            updateInformation.value[url].updateCount++
        }
    }

    function apiQueueInterval() {
        if (process.server) createError("This function is only available on the client side.")
        for (const url of updateQueue.value) {
            const lastUpdate = updateInformation.value[url]?.lastUpdated
            if (lastUpdate === undefined) {
                // console.error("🍕 lastUpdate is undefined for " + url)
                continue
            }
            const sinceLastUpdate = Date.now() - lastUpdate
            if (sinceLastUpdate > MIN_API_REFRESH_TIME.value) {
                // console.log("🍕 Queue fired " + url)
                callUrl(url)
            }
        }
    }

    const apiQueueIntervalID: NodeJS.Timeout|undefined = undefined
    onMounted(()=>{
        if (apiQueueIntervalID === undefined) {
            // console.log("🍕 Starting API queue interval.")
            setInterval(apiQueueInterval, 100)
        }
    })
    // endregion

    // region Tracking
    const lastActivityAt = ref(Date.now())
    watch(lastActivityAt, ()=>{
        sinceLastActivity.value = 0
    })
    const sinceLastActivity = ref(0)
    const visibilityState = ref<"visible"|"hidden">("visible")
    let activityIntervalID: NodeJS.Timeout|undefined = undefined
    const activityName = computed<"active"|"slow"|"inactive">(()=>{
        if (process.server) return "active"
        const visibilityMultiplier = (visibilityState.value === "visible") ? 1 : 3
        const since = sinceLastActivity.value * visibilityMultiplier
        if (since < 60 * 1000) return "active"
        if (since < 10 * 60 * 1000) return "slow"
        return "inactive"
    })

    function activityTackingVisibilityChange() {
        // console.log("🍕 Visibility changed to " + document.visibilityState)
        visibilityState.value = document.visibilityState
    }

    function activityTackingClick() {
        lastActivityAt.value = Date.now()
    }

    function activityTrackingInterval() {
        sinceLastActivity.value = Date.now() - lastActivityAt.value
    }

    function startActivityTracking() {
        if (process.server) createError("This function is only available on the client side.")
        // console.log("🍕 Starting activity tracking for client.")
        // prevent doubles as unmount is not working
        document.removeEventListener("visibilitychange", activityTackingVisibilityChange)
        document.removeEventListener("click", activityTackingClick)
        // connect
        document.addEventListener("visibilitychange", activityTackingVisibilityChange)
        document.addEventListener("click", activityTackingClick)

        if (activityIntervalID === undefined) {
            // console.log("🍕 Starting activity tracking interval.")
            activityIntervalID = setInterval(activityTrackingInterval, 1000)
        }
    }

    onMounted(()=>{
        startActivityTracking()
    })
    // endregion

    // TODO: make obsolete and remove
    function addTrack(url: string, callback: ()=>void) {
        trackForRefres.value[url] = callback
    }

    const trackList = computed(()=>{
        return Object.keys(trackForRefres.value)
    })

    return { conn, status, addTrack, trackList, updateCounter, lastActivityAt, sinceLastActivity, activityName, updateQueue, updateInformation }
})
