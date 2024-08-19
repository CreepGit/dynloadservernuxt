import { jwtDecode } from "jwt-decode"
import cookies from "js-cookie"

export const useAuthStore = defineStore("authStore", () => {
    const token = useCookie('authToken', { sameSite: 'strict' })
    const state = computed<"auth" | "noauth">(() => {
        if (token.value) {
            return 'auth'
        } else {
            return 'noauth'
        }
    })
    const hasAuth = computed(() => {
        return state.value === 'auth'
    })
    const payload = computed<undefined | { username: string, iat: number, exp: number }>(() => {
        if (token.value) {
            try {
                return jwtDecode(token.value)
            } catch (e) {
                return undefined
            }
        }
    })
    function expiresInSeconds() {
        if (payload.value) {
            return payload.value.exp - Math.floor(Date.now() / 1000)
        }
    }

    async function login({ username, password }: { username: string, password: string }) {
        token.value = undefined
        const { token: authToken } = await $fetch('/api/auth/login', { method: 'POST', body: { username, password } }) as any
        token.value = authToken as string
        // Cookie set should not be necessary with useCookie
        // cookies.set('authToken', authToken, { sameSite: 'strict', expires: 1, })
    }

    async function refresh() {
        if (token.value) {
            try {
                const { token: authToken } = await $fetch('/api/auth/status', { method: 'GET' }) as any
                if (authToken != token.value) {
                    token.value = authToken as string
                } else {
                    // Do Nothing, old token is good
                }
            } catch (error: any) {
                console.warn("Failed to refresh token", error.statusMessage)
                token.value = undefined
            }
        }
    }

    async function logout() {
        token.value = undefined
    }

    async function register({ username, password }: { username: string, password: string }) {
        token.value = undefined
        const { token: authToken } = await $fetch('/api/auth/register', { method: 'POST', body: { username, password } }) as any
        token.value = authToken as string
    }

    let refreshInterval: any = undefined;
    onMounted(()=>{
        const threeMinutes = 3 * 60 * 1000
        refreshInterval = setInterval(()=>refresh(), threeMinutes)
        setTimeout(()=>refresh(), 1000)
    })

    return { token, state, payload, hasAuth, login, logout, register, expiresInSeconds }
})
