<template>
    <div class="header" id="header">
        <div class="header-contents">
            <h1 class="header-title">Portfolio</h1>
            <div class="header-menu">
                <button
                    v-for="(menu, index) in menus"
                    :key="index"
                    class="header-menu-item"
                    @click="scrollToSection(menu.targetId)"
                >
                    {{ menu.name }}
                </button>
            </div>

            <UIDropdown hide-chevron placement="bottom">
                <template #button>
                    <i class="header-setting | icon icon-person"></i>
                </template>
                <template #dropdown>
                    <el-dropdown-menu class="header-setting-dropdown-menu">
                        <el-dropdown-item class="header-setting-dropdown-item">
                            <i class="icon icon-login"></i>
                            로그인
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </UIDropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
    const menus = computed(() => [
        {
            name: "Home",
            targetId: "main-home",
        },
        {
            name: "About",
            targetId: "main-about",
        },
        {
            name: "Works",
            targetId: "main-works",
        },
        {
            name: "Skill",
            targetId: "main-skill",
        },
        {
            name: "Contact",
            targetId: "main-contact",
        },
    ])

    const scrollToSection = (id: string): void => {
        const header = document.getElementById("header")
        const headerHeight = header?.getBoundingClientRect().height ?? 0
        const target = document.getElementById(id)

        if (target) {
            const elementTop = target.getBoundingClientRect().top
            const offsetPosition = window.scrollY + elementTop - headerHeight

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: var(--blue-dim);
        z-index: 10;

        .header-contents {
            width: 100%;
            max-width: 1200px;
            height: 58px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            color: var(--primary);

            .header-title {
                font-size: 32px;
                font-weight: 800;
            }

            .header-menu {
                height: auto;
                display: flex;
                justify-content: right;
                gap: 10px;
                font-size: 18px;
                font-weight: bold;
                flex: 1;

                .header-menu-item {
                    padding: 0 16px;
                }
            }

            .header-setting {
                margin-left: 20px;
                color: var(--primary);
            }
        }
    }
</style>
<style lang="scss">
    .header-setting-dropdown-menu {
        background: white !important;

        .header-setting-dropdown-item {
            justify-content: center;
            color: var(--primary);
        }
    }
</style>
