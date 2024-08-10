<template>
<div style="position: relative;">
    <h1>{{ title }}</h1>
    <WebsocketIndicator style="position:absolute; right: 10px; top: 10px;" />
    <p>{{ data?.message }}</p>
    <p>ws status = {{ ws.status }}</p>
    <ClientOnly>
        <pre>{{ ws.trackList }}</pre>
    </ClientOnly>
</div>
</template>

<script lang="ts" setup>
const title = ref("Server")
const ws = useWsStore()

onMounted(async ()=>{
    if (process.client) {
        title.value = "Client"
    }
})

const { data, error, refresh } = await syncFetch("/api/test")

// watch(()=>ws.needRefresh, async (v: boolean)=>{
//     if (v) {
//         await refresh()
//         ws.needRefresh = false
//     }
// })
</script>

<style scoped>
</style>
