// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    components: [
        {
            path: "~/components", // will get any components nested in let's say /components/test too
            pathPrefix: false,
        },
    ],
    css: ["~/assets/scss/main.scss"],
    modules: ["@element-plus/nuxt"],
})
