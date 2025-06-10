<template>
    <div class="embla__slide" ref="selfRef">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
    .embla__slide {
        flex: 0 0 80%;
        text-align: center;
        padding: 40px;
        box-sizing: border-box;
    }
</style>
