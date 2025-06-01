<template>
    <LayoutHeader />
    <div :style="`padding-top: ${headerHeight}px`">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    const headerHeight = ref<number>()

    onMounted(() => {
        const header = document.getElementById("header")
        headerHeight.value = header?.getBoundingClientRect().height ?? 0
    })
</script>

<style lang="scss" scoped>
    .layout-body {
        padding-top: 58px;
    }
</style>
