// https://nuxt.com/docs/api/configuration/nuxt-config
const path = require('path')
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  app:{
    baseURL: '/live-simulator',
    head: {
      title: "live-simulator",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    }
  },
  nitro: {
    output: {
      publicDir: path.join(__dirname, '.output/live-simulator')
    }
  },
})
