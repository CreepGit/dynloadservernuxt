
export default function (url: string, opts = {}) {
    const ws = useWsStore()
    const ret = useFetch(url, opts)
    
    if (process.client) {
        ws.addTrack(url, ret.refresh)
        console.log("TRACKING", url)
    }
    
    return {
        ...ret,
        data: (ret.data as Ref<any>),
    }
}
