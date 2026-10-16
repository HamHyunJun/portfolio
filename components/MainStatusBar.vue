<template>
    <footer class="status-bar" aria-hidden="true">
        <p>● master</p>
        <div class="status-right">
            <p>Ln {{ line }}, Col 1</p>
            <p>{{ file }}</p>
            <p>UTF-8</p>
            <p>Nuxt 3</p>
        </div>
    </footer>
</template>

<script setup lang="ts">
    defineProps<{
        file: string
        line: number
    }>()
</script>

<style lang="scss" scoped>
    .status-bar {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 20;
        height: 26px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #238636;
        font-family: var(--mono);
        font-size: 12px;
        color: #fff;

        p {
            font-family: var(--mono);
        }

        .status-right {
            display: flex;
            gap: 20px;
        }
    }

    // 모바일은 하단 고정 내비가 그 자리를 쓴다
    @media (max-width: 768px) {
        .status-bar {
            display: none;
        }
    }
</style>
