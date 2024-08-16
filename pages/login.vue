<template>
    <div>
        <h1>Login</h1>
        <pre>{{ auth }}</pre>
        <div class="loginform" v-if="!loggedIn">
            <input type="text" placeholder="Username" v-model="username">
            <p v-for="err in problem.username" :key="err">{{ err }}</p>
            <input type="password" placeholder="Password" v-model="password">
            <p v-for="err in problem.password" :key="err">{{ err }}</p>
            <input type="submit" value="Login" @click.prevent="auth.signIn({username, password})">
            <input type="submit" value="Register" @click.prevent="auth.signUp({username, password})">
            <pre>{{ problem }}</pre>
        </div>
        <div class="loginform" v-else>
            <input type="submit" value="Logout" @click.prevent="auth.signOut()">
        </div>
        <div class="loginform" v-if="decoded">
            <pre>{{ decoded }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import { userValid } from '~/assets/zods';

const username = ref("")
const password = ref("")
const auth = useAuth()
const problem = ref<Partial<Record<'username'|'password', string[]>>>({})

const loggedIn = computed(()=>auth.status.value == 'authenticated')

const decoded = computed(()=>{
    if (auth.token.value) {
        return jwtDecode(auth.token.value)
    }
    return ''
})
watch([username, password], ([username, password])=>{
    const { success, data, error } = userValid.safeParse({username, password})
    if (error) {
        problem.value = {...error.formErrors.fieldErrors}
    } else {
        problem.value = {}
    }
    // problem.value = error ? error : ''
})
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
