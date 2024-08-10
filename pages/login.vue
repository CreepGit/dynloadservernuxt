<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="submitLogin" class="loginform">
            <input type="text" placeholder="Username" v-model="username">
            <input type="password" placeholder="Password" v-model="password">
            <input type="submit" value="Login">
        </form>
        <form @submit.prevent="verify" class="loginform">
            <input type="text" disabled placeholder="Token" v-model="token">
            <input type="submit" value="Verify">
        </form>
    </div>
</template>

<script setup lang="ts">
const username = ref("")
const password = ref("")
const token = ref("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzIzMzAwNzEyLCJleHAiOjE3MjMzMDQzMTJ9.Bsn-uDzC0ePGnOw4WJd_vjI4wgsogdjUho0yxIz2soc")

async function submitLogin() {
    $fetch("/api/login", {
        method: "POST",
        body: {
            username: username.value,
            password: password.value,
        }
    })
}
async function verify() {
    const res = await $fetch("/api/auth", {
        method: "POST",
        body: {
            token: token.value,
        }
    })
    if ((res as any).message == "Token verified") {
        console.log("Token is valid")
    } else {
        console.log("Token is invalid")
    }
}
</script>

<style lang="scss">
.loginform {
    display: flex;
    flex-direction: column;
    gap: 0.333rem;
    width: 200px;
    padding: 1rem;
    border: 1px solid black;
    border-radius: 0.333rem;
}
</style>
