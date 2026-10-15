<template>
    <nav class="aside" aria-label="섹션 이동">
        <button
            v-for="item in navItems"
            :key="item.key"
            type="button"
            class="aside-content"
            :class="{ active: activeSection === item.key }"
            :aria-current="activeSection === item.key ? 'true' : undefined"
            @click="emit('select', item.key)"
        >
            {{ item.label }}
        </button>
    </nav>
</template>

<script setup lang="ts">
    defineProps<{
        activeSection: "about" | "skill" | "works" | null
    }>()

    const emit = defineEmits<{
        select: [key: "about" | "skill" | "works"]
    }>()

    const navItems = [
        { key: "about", label: "ABOUT" },
        { key: "skill", label: "SKILLS" },
        { key: "works", label: "WORKS" },
    ] as const
</script>

<style lang="scss" scoped>
    .aside {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 120px 0 0 30px;

        .aside-content {
            padding: 0;
            border: 0;
            background: none;
            font-size: 50px;
            font-weight: 700;
            line-height: 140%;
            color: #8a8a8a;
            cursor: pointer;
            transition:
                color 0.3s ease,
                transform 0.2s ease;

            &:hover {
                color: var(--primary);
            }

            &:active {
                transform: scale(0.96);
            }

            &.active {
                color: var(--blue);
            }

            &:focus-visible {
                outline: 2px solid var(--white);
                outline-offset: 4px;
            }
        }
    }

    @media (max-width: 768px) {
        .aside {
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            gap: 0;
            padding: 12px 8px;
            border-top: 1px solid var(--gray);

            .aside-content {
                padding: 8px 12px;
                font-size: 15px;
            }
        }
    }
</style>
