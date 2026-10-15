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
            height: 1px;
            flex: 1;
            background: repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px);
        }

        .title-text {
            margin: 0;
            font-family: var(--mono);
            font-size: 40px;
            font-weight: 700;
            letter-spacing: -0.02em;
            flex-shrink: 0;

            // 깜빡이는 터미널 커서
            &::after {
                content: "_";
                color: var(--green);
                animation: blink 1.1s steps(1) infinite;
            }

            .title-no {
                display: block;
                margin-bottom: 6px;
                font-family: var(--mono);
                font-size: 13px;
                font-weight: 400;
                letter-spacing: 0.05em;
                color: var(--green);

                &::before {
                    content: "// ";
                }
            }
        }
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .section-title-wrap .title-text::after {
            animation: none;
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
