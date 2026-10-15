<template>
    <div class="marquee" aria-hidden="true">
        <div v-for="(row, r) in rows" :key="r" class="marquee-row">
            <div class="marquee-track">
                <template v-for="copy in 2" :key="copy">
                    <template v-for="(item, i) in row" :key="item">
                        <span class="item" :class="{ solid: i % 2 === 0 }">{{ item }}</span>
                        <span class="sep">✦</span>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        items: string[]
    }>()

    // 두 줄이 서로 다른 순서·반대 방향으로 흐르게 한다
    const rows = computed(() => [props.items, [...props.items].reverse()])
</script>

<style lang="scss" scoped>
    @keyframes marquee {
        to {
            transform: translateX(-50%);
        }
    }

    .marquee {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden;
        padding: 24px 0;
        background: var(--base-background);
        border-block: 1px solid var(--line);

        .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 50s linear infinite;
        }

        .marquee-row:nth-child(2) .marquee-track {
            animation-direction: reverse;
        }

        &:hover .marquee-track {
            animation-play-state: paused;
        }

        .item,
        .sep {
            font-family: var(--mono);
            font-size: clamp(28px, 5vw, 64px);
            font-weight: 700;
            line-height: 1.3;
            white-space: nowrap;
            text-transform: uppercase;
        }

        .item {
            padding: 0 0.4em;
            color: transparent;
            -webkit-text-stroke: 1px var(--primary);
            transition: color 0.3s ease;

            &.solid {
                color: var(--white);
                -webkit-text-stroke: 0;
            }
        }

        .sep {
            color: var(--green);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .marquee .marquee-track {
            animation: none;
        }
    }
</style>
