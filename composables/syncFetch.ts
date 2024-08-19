
export default function<T=any>(url: string, opts: undefined|{ overwriteMinRefreshTime?: number, cacheExpiresMS?: number } = {}) {
    const ws = useWsStore()
    const name = ref("syncfetch" + Math.floor(Math.random() * 100000000).toString() + url)
    const immediate = process.server
    const ret = useFetch(url, {...opts, immediate: immediate, lazy: true, transform: (data) => {
        if (process.client) {
            ws.setCache(url, data, opts.cacheExpiresMS)
        }
        return data
    }})

    // TODO: Implement overwriteMinRefreshTime

    const data = computed(()=>{
        return ret.data.value || ws.getCached(url)
    }) as Ref<any>

    onMounted(() => {
        ws.track(name.value, url, ret.refresh)
        if (ws.getCached(url) === undefined) {
            if (ret.data.value) {
                ws.setCache(url, ret.data.value, opts.cacheExpiresMS)
            } else {
                console.warn("🌈🚨 firing empty url: ", url)
                ret.refresh()
            }
        }
    })

    onUnmounted(() => {
        ws.unTrack(name.value, url)
    })

    return {
        ...ret,
        data: (data as Ref<T>),
    }
}
