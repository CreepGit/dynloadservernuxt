<template>
    <Card>
        <template #content>
            <Card class="center" style="background: var(--p-neutral-100)">
                <template #content v-if="!authStore.hasAuth">
                    <h1>Register new user</h1>
                    <br>
                    <form @submit.prevent="register" class="loginForm2">
                        <FloatLabel>
                            <label for="username">Username</label>
                            <InputGroup>
                                <InputText v-model="formData.username" id="username" />
                                <Button v-if="validationMap.username && formData.username" icon="pi pi-exclamation-circle" severity="warn" @click="usernamePopover?.toggle" />
                                <Popover ref="usernamePopover">
                                    <p v-for="problem in validationMap.username">{{problem}}</p>
                                </Popover>
                            </InputGroup>
                        </FloatLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-key"></i>
                            </InputGroupAddon>
                            <InputText v-model="formData.password" type="password" id="password" placeholder="Password" :feedback="false" :toggle-mask="true" />
                            <Button v-if="validationMap.password && formData.password" icon="pi pi-exclamation-circle" severity="warn" @click="passwordPopover?.toggle" />
                            <Popover ref="passwordPopover">
                                <p v-for="problem in validationMap.password">{{problem}}</p>
                            </Popover>
                        </InputGroup>
                        <Button type="submit" label="Register" :disabled="!formData.buttonEnabled" style="width: 100%;" />
                        <Message v-if="formData.problem" severity="warn">🌶️ {{formData.problem}}</Message>
                    </form>
                </template>
                <template #content v-else>
                    <h1>Register new user</h1>
                    <br>
                    <h3>You are logged in already.</h3>
                </template>
            </Card>
        </template>
    </Card>
</template>

<script setup lang="ts">
import type { MenuMethods } from 'primevue/menu';
import { UserValid } from '~/assets/zods';
const authStore = useAuthStore()
const formData = reactive({
    username: "",
    password: "",
    problem: "",
    buttonEnabled: true,
})
const validationProblems = computed(()=>{
    const { success, error } = UserValid.safeParse({username: formData.username, password: formData.password})
    if (success) return ''
    return error.errors.map(e=>e.message).join('\n')
})
const validationMap = computed(() => {
    const { success, error } = UserValid.safeParse({username: formData.username, password: formData.password})
    if (success) return {}
    return error.flatten().fieldErrors
})
const usernamePopover = ref<MenuMethods|undefined>(undefined)
const passwordPopover = ref<MenuMethods|undefined>(undefined)
async function register() {
    formData.buttonEnabled = true;
    formData.problem = "";
    authStore.register({username: formData.username, password: formData.password}).then(()=>{
        formData.problem = "";
    }).catch((e:any)=>{
        console.error(e.statusMessage);
        formData.problem = e.statusMessage;
    }).finally(()=>{
        setTimeout(()=>formData.buttonEnabled = true, 1000);
    });
}
</script>