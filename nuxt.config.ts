import inspectorAgent from '@inspector-agent/vite-plugin'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    devServer: {
        port: 3004,
    },
    components: [
        {
            path: "~/components", // will get any components nested in let's say /components/test too
            pathPrefix: false,
        },
    ],
    css: ["~/assets/scss/main.scss"],
    vite: {
        plugins: [inspectorAgent()],
        // 임시 터널(cloudflared)로 외부에서 접속할 때만 필요
        server: { allowedHosts: [".trycloudflare.com"] },
    },
})
