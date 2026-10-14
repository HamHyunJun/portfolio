<template>
    <div class="section-title-wrap">
        <div class="title-divider"></div>
        <h2 class="title-text">{{ title }}</h2>
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
            margin: 0;
            font-size: 40px;
            font-weight: 700;
            flex-shrink: 0;
        }
    }

    @media (max-width: 768px) {
        .section-title-wrap {
            gap: 16px;

            .title-text {
                font-size: 24px;
            }
        }
    }
</style>
