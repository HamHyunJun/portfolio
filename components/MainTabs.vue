<template>
    <nav class="tabs" aria-label="열린 파일">
        <button
            v-for="file in files"
            :key="file.key"
            type="button"
            class="tab"
            :class="{ active: activeSection === file.key }"
            :aria-current="activeSection === file.key ? 'true' : undefined"
            @click="emit('select', file.key)"
        >
            <i class="tab-icon" :style="{ color: file.color }" aria-hidden="true">
                {{ file.glyph }}
            </i>
            {{ file.name }}
            <span class="tab-close" aria-hidden="true">×</span>
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
    .tabs {
        display: flex;
        overflow-x: auto;
        background: var(--sidebar);
        border-bottom: 1px solid var(--line);

        .tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 16px;
            height: 40px;
            border: 0;
            border-top: 2px solid transparent;
            border-right: 1px solid var(--line);
            background: none;
            font-family: var(--mono);
            font-size: 13px;
            color: var(--primary);
            white-space: nowrap;
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

            &:focus-visible {
                outline: 2px solid var(--white);
                outline-offset: -3px;
            }

            &.active {
                color: var(--white);
                background: var(--base-background);
                border-top-color: var(--green);
                // 활성 탭이 아래 에디터와 이어져 보이게 한다
                margin-bottom: -1px;
            }

            .tab-icon {
                font-family: var(--mono);
                font-size: 11px;
                font-style: normal;
                font-weight: 700;
            }

            .tab-close {
                font-size: 15px;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            &:hover .tab-close,
            &.active .tab-close {
                opacity: 0.6;
            }
        }
    }

    // 모바일은 하단 내비가 같은 역할을 하므로 탭 바를 숨긴다
    @media (max-width: 768px) {
        .tabs {
            display: none;
        }
    }
</style>
