<template>
    <div class="works">
        <MainSectionTitle title="WORKS" />
        <div class="works-content">
            <UICarousel class="carousel" @change="selectedIndex = $event">
                <UICarouselSlide v-for="index in 3" :key="index" class="carousel-slide">
                    <div class="slide-container" :class="{ active: index === selectedIndex + 1 }">
                        <div class="slide-background-wrap">
                            <img
                                :src="`https://picsum.photos/600/350?v=${index}`"
                                class="slide-background"
                            />
                        </div>
                        <div class="slide-contents">
                            <img
                                :src="`https://picsum.photos/600/350?v=${index}`"
                                class="contents-image"
                            />
                            <p class="contents-text">Contents Title</p>
                        </div>
                    </div>
                </UICarouselSlide>
            </UICarousel>
        </div>
    </div>
</template>

<script setup lang="ts">
    const selectedIndex = ref<number>(0)
</script>

<style lang="scss" scoped>
    .works {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .works-content {
            .carousel {
                cursor: pointer;

                .carousel-slide {
                    .slide-container {
                        height: 600px;
                        background: var(--blue-dim);
                        border-radius: var(--rounded);
                        opacity: 0.5;
                        transform: scale(1);
                        transition:
                            opacity 0.4s ease,
                            transform 0.4s ease;
                        z-index: 0;
                        position: relative;
                        overflow: hidden;

                        &.active {
                            opacity: 1;
                            transform: scale(1.1);
                            z-index: 1;
                        }

                        .slide-background-wrap {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 0;
                            overflow: hidden;

                            .slide-background {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                filter: blur(5px) brightness(0.6);
                                opacity: 0.8;
                            }
                        }

                        .slide-contents {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            z-index: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                            gap: 20px;

                            .contents-image {
                                width: 70%;
                                height: 70%;
                                object-fit: cover;
                                border-radius: var(--rounded-lg);
                            }

                            .contents-text {
                                font-size: 32px;
                                font-weight: bold;
                                color: var(--white);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
