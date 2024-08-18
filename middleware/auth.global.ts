import { jwtDecode } from "jwt-decode"

const allowedPages = ["/", "/about", "/register" ]

export default defineNuxtRouteMiddleware((to, from) => {
    if (allowedPages.includes(to.path)) return;
    const cookie = useCookie("authToken")
    if (!cookie.value) {
        useToast().add({severity: "error", life: 3000, summary: "Not logged in", detail: "You need to be authenticated to access this page"})
        return abortNavigation()
    }
    let payload;
    try {
        payload = jwtDecode(cookie.value as string)
        if (!payload) throw new Error("Invalid payload")
        if (!payload.exp) throw new Error("Invalid payload")
    } catch (e) {
        useToast().add({severity: "error", life: 3000, summary: "Invalid auth cookie", detail: "Cookie has been deleted. Please log in again."})
        cookie.value = undefined
        return navigateTo("/")
    }
    const now = Math.floor(Date.now() / 1000)
    if (now > payload.exp) {
        useToast().add({severity: "error", life: 3000, summary: "Session expired", detail: "Please log in again."})
        cookie.value = undefined
        return navigateTo("/")
    }
})
