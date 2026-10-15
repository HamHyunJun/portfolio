<template>
    <div class="embla__slide">
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

    @media (max-width: 1100px) {
        .embla__slide {
            flex-basis: 90%;
            padding: 20px 10px;
        }
    }
</style>
