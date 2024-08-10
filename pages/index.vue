<template>
<div>
    <h1>{{ title }}</h1>
    <p>val {{ value }}</p>
    <button @click="value++">Add</button>
</div>
</template>

<script lang="ts" setup>
const value = ref(0)
const title = ref("Server")

useFetch("/api/test?" + (process.client ? "client" : "server"), {server: false}).then(async ({data}) => {
    interface data {
        message: string,
    }
    console.log((data.value as data).message)
})

onMounted(async ()=>{
    if (process.client) {
        title.value = "Client"
    }
})

// onServerPrefetch(async ()=>{
//     // const res = await fetch("/api/test?" + (process.client ? "client" : "server"))
//     // console.log(await res.json())
//     const { data } = await useFetch("/api/test?" + (process.client ? "client" : "server"))
//     console.log(data.value.message)
// })
</script>

<style scoped>
</style>
