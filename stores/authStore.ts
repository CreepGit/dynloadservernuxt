import Cookies from 'js-cookie'

export const useAuthStore = defineStore("authStore", ()=>{
    console.log("Client cookie", Cookies.get('authToken'))
    const authToken = ref(Cookies.get('authToken'))

    onMounted(async ()=>{
        authToken.value = Cookies.get('authToken')
    })

    // const username = ref("x")
    let username = ref("server");
    return { username, authToken }
})
