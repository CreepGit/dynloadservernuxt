<template>
    <div>
        <h1>Login</h1>
        <form v-if="!authStore.hasAuth" @submit.prevent="login" class="loginform">
            <input type="text" placeholder="Username" v-model="username">
            <input type="password" placeholder="Password" v-model="password">
            <input type="submit" value="Login">
            <div v-if="loginProblem" class="issue">🌶️ {{loginProblem}}</div>
            <div v-if="validationProblems">
                <pre>{{validationProblems}}</pre>
            </div>
        </form>
        <form v-else @submit.prevent="authStore.logout" class="loginform">
            <input type="submit" value="Logout">
        </form>
        <div>
            <h4>Store</h4>
            <pre>{{ {token: authStore.token, payload: authStore.payload, state: authStore.state, hasAuth: authStore.hasAuth } }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserValid } from '~/assets/zods';

const username = ref("")
const password = ref("")
const authStore = useAuthStore()
const loginProblem = ref("")

const validationProblems = computed(()=>{
    const { success, error } = UserValid.safeParse({username: username.value, password: password.value})
    if (success) return ''
    return error.errors.map(e=>e.message).join('\n')
})

async function login() {
    authStore.login({username: username.value, password: password.value}).then(()=>{
        loginProblem.value = ""
    }).catch((e:any)=>{
        console.error(e.statusMessage)
        loginProblem.value = e.statusMessage
    })
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
.issue {
    color: darkred;
}
</style>
