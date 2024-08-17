<template>
    <div>
        <Card style="overflow-x: auto;">
            <template #content>
                <h1>Login</h1>
                <form v-if="!authStore.hasAuth" @submit.prevent="login" class="loginForm2">
                    <FloatLabel>
                        <label for="username">Username</label>
                        <InputGroup>
                            <InputText v-model="username" id="username" />
                        </InputGroup>
                    </FloatLabel>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-key"></i>
                        </InputGroupAddon>
                        <Password v-model="password" id="password" placeholder="Password" :feedback="false" :toggle-mask="true" />
                    </InputGroup>
                    <Button type="submit" label="Login" :disabled="loginDisabled" />
                    <div v-if="loginProblem" class="issue">🌶️ {{loginProblem}}</div>
                    <div v-if="validationProblems">
                        <pre>{{validationProblems}}</pre>
                    </div>
                </form>
                <Button v-else label="Logout" @click="authStore.logout" />
                <div>
                    <pre style="overflow-x: hidden;">{{ {token: authStore.token, payload: authStore.payload, state: authStore.state, hasAuth: authStore.hasAuth } }}</pre>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { UserValid } from '~/assets/zods';

const username = ref("")
const password = ref("")
const authStore = useAuthStore()
const loginProblem = ref("")
const loginDisabled = ref(false)

const validationProblems = computed(()=>{
    const { success, error } = UserValid.safeParse({username: username.value, password: password.value})
    if (success) return ''
    return error.errors.map(e=>e.message).join('\n')
})

async function login() {
    loginDisabled.value = true
    loginProblem.value = ""
    authStore.login({username: username.value, password: password.value}).then(()=>{
        loginProblem.value = ""
    }).catch((e:any)=>{
        console.error(e.statusMessage)
        loginProblem.value = e.statusMessage
    }).finally(()=>{
        setTimeout(()=>loginDisabled.value = false, 1000)
    })
}
</script>

<style lang="scss">
.loginForm2 {
    margin-top: 2rem;
    display: flex;
    max-width: 500px;
    flex-direction: column;

    &>* {
        width: 100%;
    }
}
</style>
