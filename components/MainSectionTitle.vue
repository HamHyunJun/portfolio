<template>
    <div class="section-title-wrap">
        <div class="title-divider"></div>
        <p class="title-text">{{ title }}</p>
        <div class="title-divider"></div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        title: string
    }>()
</script>

<style lang="scss" scoped>
    .section-title-wrap {
        display: flex;
        align-items: center;
        gap: 50px;

        .title-divider {
            height: 2px;
            width: 100%;
            background: var(--gray);
        }

        .title-text {
            font-size: 40px;
            font-weight: 700;
            flex-shrink: 0;
        }
    }
</style>
