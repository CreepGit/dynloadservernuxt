<template>
<div style="position: relative;">
    <h1>{{ title }}</h1>
    <p>val {{ value }}</p>
    <button @click="value++">Add</button>
    <p>ws {{ ws.x }}</p>
    <button @click="ws.x++">Add</button>
    <WebsocketIndicator style="position:absolute; right: 10px; top: 10px;" />
    <p>{{ data?.message }}</p>
    <p>{{ msg }}</p>
</div>
</template>

<script lang="ts" setup>
const value = ref(0)
const title = ref("Server")
const ws = useWsStore()
const msg = ref("wait...")

onMounted(async ()=>{
    if (process.client) {
        title.value = "Client"
    }
})

const { data, error } = await useFetch("/api/test")
console.log(data.value?.message)

msg.value = data.value!.message
</script>

<style scoped>
</style>
