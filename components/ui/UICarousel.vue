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
                        delay: 6000,
                        stopOnMouseEnter: true,
                    }),
                ]
            )
            embla.on("select", updateSelectedIndex)
            embla.on("init", updateSelectedIndex)
            updateSelectedIndex()
        }
    })

    const updateSelectedIndex = (): void => {
        emit("change", embla?.selectedScrollSnap() ?? 0)
    }

    onBeforeUnmount(() => embla?.destroy())
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
