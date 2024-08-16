// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    experimental: {
      websocket: true,
    }
  },
  modules: ['@pinia/nuxt', "@sidebase/nuxt-auth"],
  auth: {
    baseURL: '/api/auth',
    provider: {
      type: 'refresh',
      token: {
        signInResponseTokenPointer: '/token',
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/refreshToken',
      }
    },
    globalAppMiddleware: true,
  }
})