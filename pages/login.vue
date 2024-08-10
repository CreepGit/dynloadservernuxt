<template>
    <div>
        <h1>{{ auth.username||'Not logged in' }}</h1>
        <form @submit.prevent="submitLogin" class="loginform">
            <input type="text" placeholder="Username" v-model="username">
            <input type="password" placeholder="Password" v-model="password">
            <input type="submit" value="Login">
            <span class="error">{{ loginError }}</span>
        </form>
        <form @submit.prevent="verify" class="loginform">
            <input type="text" disabled placeholder="Token" v-model="auth.authToken">
            <input type="submit" value="Verify">
            <span class="error">{{ fetchError }}</span>
        </form>
    </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie"

const username = ref("")
const password = ref("")
const loginError = ref("")
const fetchError = ref("")
const auth = useAuthStore()

async function submitLogin() {
    const response = await $fetch("/api/login", {
        method: "POST",
        body: {
            username: username.value,
            password: password.value,
        }
    }).catch(error => {
        loginError.value = "⚠️" + error.statusText
    })
    if (response?.token) {
        loginError.value = "✅ Cookie set"
        const threeHoursInTheFuture = new Date(Date.now() + 3 * 60 * 60 * 1000)
        Cookies.set("authToken", response.token, { expires: threeHoursInTheFuture })
        auth.authToken = response.token
    }
}
async function verify() {
    const res = await $fetch("/api/auth", {
        method: "POST",
        body: {
            token: auth.authToken,
        }
    }).catch(error => {
        fetchError.value = "⚠️" + error.statusText
    })
    if (res) {
        const exp = new Date((res.payload as any).exp * 1000)
        const timeTil = Math.floor((exp.getTime() - Date.now())/1000/60) + " min"
        const name = (res.payload as any).username
        fetchError.value = "✅ Token is valid, Expires: " + timeTil + ", user: " + name
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

.error {
    color: rgb(90, 5, 5);
}
</style>
