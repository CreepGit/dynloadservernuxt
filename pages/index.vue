<template>
<div style="position: relative;">
    <Card style="overflow-x: auto;">
        <template #content>
            <h1>{{ title }}</h1>
            <pre>{{ data?.message }}</pre>
            <p>ws status = {{ ws.status }}</p>
            <ClientOnly>
                <pre>sync{{ ws.trackList }}</pre>
            </ClientOnly>
            <br>
            <div class="form">
                <input type="text" disabled :value="formData?.message">
                <form @submit.prevent="submitTestForm">
                    <input type="text" placeholder="write to the database" v-model="formText" style="flex-grow: 1;">
                    <input type="submit" value="Send">
                </form>
            </div>
        </template>
    </Card>
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

const { data, error, refresh } = await syncFetch("/api/test") as any
const { data: formData } = await syncFetch("/api/testform") as any
// Type works belo, not above 😭
// const { data, error, refresh } = await useFetch("/api/test")
const formText = ref("")
async function submitTestForm() {
    await $fetch("/api/testform", {
        method: "POST",
        body: {
            value: formText.value
        },
    })
    formText.value = ""
}

</script>

<style scoped>
.form {
    box-sizing: border-box;
    display: inline-block;
}
.form > input {
    width: 400px;
    box-sizing: border-box;
}
.form > form {
    display: flex;
    width: 400px;
}
</style>
