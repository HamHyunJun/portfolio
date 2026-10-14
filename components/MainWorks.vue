<template>
    <div class="works">
        <MainSectionTitle title="WORKS" />
        <div v-if="works.length" class="works-content">
            <UICarousel class="carousel" @change="selectedIndex = $event">
                <UICarouselSlide
                    v-for="(work, index) in works"
                    :key="work.name"
                    class="carousel-slide"
                >
                    <article class="slide-container" :class="{ active: index === selectedIndex }">
                        <img
                            v-if="work.image"
                            :src="work.image"
                            :alt="`${work.name} 화면`"
                            loading="lazy"
                            decoding="async"
                            class="slide-image"
                        />
                        <div class="slide-body">
                            <button
                                :id="`work-toggle-${index}`"
                                type="button"
                                class="slide-toggle"
                                :aria-expanded="isOpen"
                                :aria-controls="`work-panel-${index}`"
                                @click="isOpen = !isOpen"
                            >
                                <span class="toggle-text">
                                    <span class="toggle-title">{{ work.name }}</span>
                                    <span class="toggle-period">{{ work.period }}</span>
                                </span>
                                <i class="icon icon-plus" :class="{ open: isOpen }"></i>
                            </button>
                            <div
                                :id="`work-panel-${index}`"
                                class="slide-panel"
                                :class="{ open: isOpen }"
                                role="region"
                                :aria-labelledby="`work-toggle-${index}`"
                                :inert="!isOpen"
                            >
                                <div class="panel-inner">
                                    <p class="panel-summary">{{ work.summary }}</p>
                                    <ul class="panel-stack">
                                        <li v-for="tech in work.stack" :key="tech">{{ tech }}</li>
                                    </ul>
                                    <div class="panel-links">
                                        <a
                                            v-for="link in work.links"
                                            :key="link.href"
                                            :href="link.href"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="panel-link"
                                        >
                                            {{ link.label }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </UICarouselSlide>
            </UICarousel>
        </div>
        <p v-else class="works-empty">프로젝트를 준비하고 있습니다.</p>
    </div>
</template>

<script setup lang="ts">
    import { works } from "~/data/works"

    const selectedIndex = ref<number>(0)
    // 상세창 열림 상태는 카드 전체가 공유해, 넘겨도 열림/닫힘이 유지된다
    const isOpen = ref<boolean>(false)
</script>

<style lang="scss" scoped>
    .works {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .works-empty {
            padding: 60px 0;
            text-align: center;
            color: var(--primary);
        }

        .works-content {
            .carousel {
                .carousel-slide {
                    .slide-container {
                        height: 100%;
                        background: var(--gray);
                        border-radius: var(--rounded);
                        transform: scale(1);
                        transition: transform 0.4s ease;
                        z-index: 0;
                        position: relative;
                        overflow: hidden;

                        &.active {
                            transform: scale(1.05);
                            z-index: 1;

                            .slide-image {
                                opacity: 1;
                            }
                        }

                        // 텍스트 대비를 지키기 위해 비활성 카드는 이미지만 흐리게 처리
                        .slide-image {
                            opacity: 0.5;
                            transition: opacity 0.4s ease;
                            display: block;
                            width: 100%;
                            aspect-ratio: 16 / 9;
                            object-fit: cover;
                        }

                        .slide-toggle {
                            width: 100%;
                            padding: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 16px;
                            border: 0;
                            background: none;
                            color: var(--white);
                            text-align: left;
                            cursor: pointer;
                            transition: background-color 0.2s ease;

                            &:hover {
                                background: rgb(255 255 255 / 5%);
                            }

                            &:focus-visible {
                                outline: 2px solid var(--white);
                                outline-offset: -4px;
                            }

                            .toggle-text {
                                display: flex;
                                flex-direction: column;
                                gap: 4px;
                            }

                            .toggle-title {
                                font-size: 24px;
                                font-weight: 700;
                            }

                            .toggle-period {
                                font-size: 14px;
                                color: var(--primary);
                            }

                            .icon-plus {
                                flex-shrink: 0;
                                transition: transform 0.3s ease;

                                &.open {
                                    transform: rotate(45deg);
                                }
                            }
                        }

                        .slide-panel {
                            display: grid;
                            grid-template-rows: 0fr;
                            transition: grid-template-rows 0.3s ease;

                            &.open {
                                grid-template-rows: 1fr;
                            }

                            .panel-inner {
                                min-height: 0;
                                overflow: hidden;
                                padding: 0 24px;
                                display: flex;
                                flex-direction: column;
                                gap: 16px;
                                text-align: left;
                                color: var(--white);
                            }

                            &.open .panel-inner {
                                padding-bottom: 24px;
                            }

                            .panel-summary {
                                font-size: 15px;
                            }

                            .panel-stack {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 8px;
                                list-style: none;
                                padding: 0;
                                margin: 0;

                                li {
                                    padding: 4px 12px;
                                    border-radius: var(--rounded-full);
                                    background: var(--base-background);
                                    font-size: 13px;
                                }
                            }

                            .panel-links {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 12px;
                            }

                            .panel-link {
                                color: var(--white);
                                font-weight: 600;
                                text-decoration: underline;
                                text-underline-offset: 4px;

                                &:focus-visible {
                                    outline: 2px solid var(--white);
                                    outline-offset: 3px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .works .works-content .carousel .carousel-slide .slide-container.active {
            transform: none;
        }
    }
</style>
