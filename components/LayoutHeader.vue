<template>
    <div class="header">
        <div class="header-contents">
            <h1 class="header-title">Portfolio</h1>
            <div class="header-menu">
                <button class="header-menu-item">Home</button>
                <button class="header-menu-item">About</button>
                <button class="header-menu-item">Skill</button>
                <button class="header-menu-item">Works</button>
                <button class="header-menu-item">Contact</button>
            </div>
            <div
                class="active-bar"
                :style="{
                    left: `${activeBarInfo?.left}px`,
                    width: `${activeBarInfo?.width}px`,
                }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute()

    const menuEls = ref<HTMLDivElement[]>()
    const menus = computed(() => [
        {
            name: "menu.partners.lnb.ai.studio",
            href: "/ai/studio",
            hide: false,
            active: route.path === "/ai/studio",
        },
        {
            name: "menu.partners.lnb.ai.make",
            href: "/ai/make",
            hide: false,
            active: ["/ai/make", "/ai/voice", "/ai/file", "/ai/youtube"].includes(route.path),
        },
        {
            name: "menu.partners.lnb.ai.studio.library",
            href: "/ai/library",
            hide: false,
            active: route.path.startsWith("/ai/library"),
        },
        {
            name: "menu.partners.lnb.ai.studio.project",
            href: "/ai/project",
            hide: false,
            active: route.path === "/ai/project",
        },
        {
            name: "menu.partners.lnb.ai.studio.guide",
            href: "/ai/guide",
            hide: false,
            active: route.path.startsWith("/ai/guide"),
        },
    ])

    const activeBarInfo = computed<{ left: number; width: number }>(() => {
        const index = menus.value.findIndex(({ active }) => active)
        const activeMenuEl = menuEls.value?.[index]
        if (activeMenuEl == null) return { left: 0, width: 0 }
        return { left: activeMenuEl.offsetLeft, width: activeMenuEl.offsetWidth }
    })
</script>

<style lang="scss" scoped>
    .header {
        background: #dbe2ef;

        .header-contents {
            width: 100%;
            max-width: 1200px;
            height: 58px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #112d4e;

            .header-title {
                font-size: 32px;
                font-weight: 800;
            }

            .header-menu {
                height: auto;
                display: flex;
                gap: 10px;
                font-size: 18px;
                font-weight: bold;

                .header-menu-item {
                    padding: 0 16px;
                }
            }

            .active-bar {
                position: absolute;
                bottom: 0;
                left: 0;

                width: 100%;
                height: 2px;
                background: red;

                transition: left 300ms cubic-bezier(0.17, 0.67, 0.29, 1);
            }
        }
    }
</style>
