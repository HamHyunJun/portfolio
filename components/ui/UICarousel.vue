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

    // 카드 클릭으로 해당 슬라이드로 넘기기 위해 노출한다
    defineExpose({ scrollTo: (index: number): void => embla?.scrollTo(index) })

    const emblaRef = ref<HTMLElement>()

    let embla: ReturnType<typeof EmblaCarousel>

    onMounted(async (): Promise<void> => {
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

    onBeforeUnmount((): void => embla?.destroy())
</script>

<style lang="scss" scoped>
    .embla {
        padding: 0 10px;
        overflow: hidden;

        .embla__container {
            display: flex;
            // 마우스 드래그로 넘길 때 글자가 선택되지 않도록 한다
            user-select: none;
            -webkit-user-select: none;
        }
    }
</style>
