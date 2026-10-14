<template>
    <div class="aside">
        <p
            v-for="item in navItems"
            :key="item.key"
            class="aside-content"
            :class="{ active: activeSection === item.key }"
            @click="emit('select', item.key)"
        >
            {{ item.label }}
        </p>
    </div>
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
        gap: 8px;
        padding: 120px 0 0 30px;

        .aside-content {
            font-size: 50px;
            font-weight: 700;
            color: var(--gray);
            cursor: pointer;
            transition: color 0.3s ease;

            &.active {
                color: var(--white);
            }
        }
    }
</style>
