<template>
    <div class="section-title-wrap">
        <div class="title-divider"></div>
        <h2 class="title-text">
            <span v-if="no" class="title-no" aria-hidden="true">{{ no }}</span>
            {{ title }}
        </h2>
        <div class="title-divider"></div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        title: string
        no?: string
    }>()
</script>

<style lang="scss" scoped>
    .section-title-wrap {
        display: flex;
        align-items: center;
        gap: 50px;

        .title-divider {
            height: 2px;
            flex: 1;
            background: linear-gradient(90deg, var(--gray), rgb(143 168 255 / 35%));
        }

        .title-divider:first-child {
            background: linear-gradient(270deg, var(--gray), rgb(143 168 255 / 35%));
        }

        .title-text {
            margin: 0;
            font-size: 40px;
            font-weight: 700;
            flex-shrink: 0;

            .title-no {
                display: block;
                margin-bottom: 6px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.2em;
                color: var(--blue);
            }
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
