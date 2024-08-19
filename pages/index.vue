<template>
    <div style="position: relative;">
        <Card style="overflow-x: auto;">
            <template #content>
                <h1>{{ title }}</h1>
                <pre>{{ data?.message }}</pre>
                <p>ws status = {{ ws.status }}</p>
                <!-- <br> -->
                <!-- <pre>{{ ws.fetchCache }}</pre> -->
                <br>
                <div class="form">
                    <div :key="i" v-for="msg, i in formData?.oldMessages">{{ msg.message }} <span v-show="msg.by"
                            style="color: var(--p-amber-700);">by {{ msg.by }}</span></div>
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

onMounted(async () => {
    title.value = "Client"
})

const { data, error } = syncFetch<{ message: string, }>("/api/test")
const { data: formData } = syncFetch<{ message: string, oldMessages: { message: string, by: string }[] }>("/api/testform")

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

.form>input {
    width: 400px;
    box-sizing: border-box;
}

.form>form {
    display: flex;
    width: 400px;
}
</style>
