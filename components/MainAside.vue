<template>
    <nav class="aside" aria-label="파일 탐색기">
        <p class="aside-title" aria-hidden="true">EXPLORER</p>
        <p class="aside-root" aria-hidden="true">▾ PORTFOLIO</p>
        <button
            v-for="file in files"
            :key="file.key"
            type="button"
            class="aside-content"
            :class="{ active: activeSection === file.key }"
            :aria-current="activeSection === file.key ? 'true' : undefined"
            @click="emit('select', file.key)"
        >
            <i class="file-icon" :style="{ color: file.color }" aria-hidden="true">
                {{ file.glyph }}
            </i>
            {{ file.name }}
        </button>
    </nav>
</template>

<script setup lang="ts">
    import type { NavFile, SectionKey } from "~/structure/user"

    defineProps<{
        files: NavFile[]
        activeSection?: SectionKey
    }>()

    const emit = defineEmits<{
        select: [key: SectionKey]
    }>()
</script>

<style lang="scss" scoped>
    .aside {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 16px 0;
        background: var(--sidebar);
        border-right: 1px solid var(--line);

        p {
            font-family: var(--mono);
            font-size: 11px;
            letter-spacing: 0.15em;
            color: #8b949e;
        }

        .aside-title {
            padding: 0 20px;
            margin-bottom: 16px;
        }

        .aside-root {
            padding: 0 12px;
            margin-bottom: 4px;
            font-weight: 700;
            color: var(--white);
        }

        .aside-content {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 12px 4px 32px;
            border: 0;
            border-left: 2px solid transparent;
            background: none;
            font-family: var(--mono);
            font-size: 14px;
            text-align: left;
            color: #8b949e;
            cursor: pointer;
            transition:
                color 0.2s ease,
                background-color 0.2s ease,
                border-color 0.2s ease,
                transform 0.2s ease;

            &:hover {
                color: var(--white);
                background: rgb(255 255 255 / 4%);
            }

            &:active {
                transform: scale(0.97);
            }

            &.active {
                color: var(--white);
                background: rgb(255 255 255 / 8%);
                border-left-color: var(--green);
            }

            &:focus-visible {
                outline: 2px solid var(--white);
                outline-offset: -2px;
            }

            .file-icon {
                width: 18px;
                font-family: var(--mono);
                font-size: 11px;
                font-style: normal;
                font-weight: 700;
            }
        }
    }

    @media (max-width: 768px) {
        // 탭 바 형태: 같은 폭으로 나누고 칸 사이에 구분선, 활성 칸은 위쪽 그린 선과 배경으로 강조
        .aside {
            flex-direction: row;
            align-items: stretch;
            padding: 0 0 env(safe-area-inset-bottom);
            border-top: 1px solid var(--line);
            border-right: 0;

            p {
                display: none;
            }

            .aside-content {
                flex: 1;
                min-width: 0;
                flex-direction: column;
                justify-content: center;
                gap: 4px;
                height: 56px;
                padding: 0 2px;
                border-left: 0;
                border-right: 1px solid var(--line);
                font-size: 11px;
                color: var(--white);

                &:last-child {
                    border-right: 0;
                }

                &.active {
                    background: rgb(63 185 80 / 12%);
                    box-shadow: inset 0 2px 0 var(--green);
                }

                .file-icon {
                    width: auto;
                    font-size: 12px;
                }
            }
        }
    }
</style>
