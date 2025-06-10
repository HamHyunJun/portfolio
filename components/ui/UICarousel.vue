<template>
    <div class="embla" ref="emblaRef">
        <div class="embla__container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import EmblaCarousel from "embla-carousel"
    import Autoplay from "embla-carousel-autoplay"

    const emit = defineEmits<{
        (e: "change", index: number): void
    }>()

    const emblaRef = ref<HTMLElement>()
    const selectedIndex = ref<number>(0)

    let embla: ReturnType<typeof EmblaCarousel>

    onMounted(async () => {
        await nextTick()
        if (emblaRef.value) {
            embla = EmblaCarousel(
                emblaRef.value,
                {
                    loop: true,
                    align: "center",
                },
                [
                    Autoplay({
                        delay: 3000,
                    }),
                ]
            )
            embla.on("select", updateSelectedIndex)
            embla.on("init", updateSelectedIndex)
            updateSelectedIndex()
        }
    })

    const updateSelectedIndex = (): void => {
        const index = embla?.selectedScrollSnap() ?? 0
        selectedIndex.value = index
        emit("change", index)
    }

    provide("selectedIndex", selectedIndex)
</script>

<style lang="scss" scoped>
    .embla {
        padding: 0 10px;
        overflow: hidden;

        .embla__container {
            display: flex;
        }
    }
</style>
