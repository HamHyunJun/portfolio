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
                        <div
                            v-if="work.webImage"
                            class="slide-media"
                            :class="{ 'has-app': work.appImage }"
                        >
                            <div class="media-stage">
                                <div class="media-layer" :class="{ show: viewOf(work) === 'web' }">
                                    <img
                                        :src="work.webImage"
                                        :alt="`${work.name} 웹 화면`"
                                        :aria-hidden="viewOf(work) !== 'web'"
                                        loading="lazy"
                                        decoding="async"
                                        class="slide-image"
                                    />
                                </div>
                                <div
                                    v-if="work.appImage"
                                    class="media-layer media-layer-app"
                                    :class="{ show: viewOf(work) === 'app' }"
                                >
                                    <img
                                        :src="work.appImage"
                                        :alt="`${work.name} 앱 화면`"
                                        :aria-hidden="viewOf(work) !== 'app'"
                                        loading="lazy"
                                        decoding="async"
                                        class="slide-image-app"
                                    />
                                </div>
                            </div>
                            <div v-if="work.appImage" class="media-tabs" role="group" aria-label="화면 종류">
                                <button
                                    v-for="view in views"
                                    :key="view"
                                    type="button"
                                    class="media-tab"
                                    :class="{ active: viewOf(work) === view }"
                                    :aria-pressed="viewOf(work) === view"
                                    @click="viewMap[work.name] = view"
                                >
                                    {{ view.toUpperCase() }}
                                </button>
                            </div>
                        </div>
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
                                    <span class="toggle-period">{{ work.period }}</span>
                                    <span class="toggle-title">{{ work.name }}</span>
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
                                    <ul class="panel-stack" aria-label="사용 기술">
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
    import type { MainWorkData } from "~/structure/user"

    type MediaView = "web" | "app"

    const views: MediaView[] = ["web", "app"]
    const selectedIndex = ref<number>(0)
    // 상세창 열림 상태는 카드 전체가 공유해, 넘겨도 열림/닫힘이 유지된다
    const isOpen = ref<boolean>(false)
    // 카드별 웹/앱 화면 선택. 기본은 웹
    const viewMap = reactive<Record<string, MediaView>>({})

    const viewOf = (work: MainWorkData): MediaView => viewMap[work.name] ?? "web"
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
                        border: 1px solid rgb(255 255 255 / 8%);
                        border-radius: var(--rounded-lg);
                        transform: scale(1);
                        transition:
                            transform 0.4s ease,
                            border-color 0.4s ease;
                        z-index: 0;
                        position: relative;
                        overflow: hidden;

                        &.active {
                            transform: scale(1.05);
                            z-index: 1;
                            border-color: rgb(255 255 255 / 20%);

                            .slide-media .media-stage {
                                opacity: 1;
                            }
                        }

                        .slide-media {
                            position: relative;

                            // 텍스트 대비를 지키기 위해 비활성 카드는 이미지만 흐리게 처리
                            .media-stage {
                                position: relative;
                                aspect-ratio: 16 / 9;
                                overflow: hidden;
                                opacity: 0.5;
                                transition: opacity 0.4s ease;
                                background: var(--base-background);

                                .media-layer {
                                    position: absolute;
                                    inset: 0;
                                    opacity: 0;
                                    visibility: hidden;
                                    transition:
                                        opacity 0.35s ease,
                                        visibility 0.35s;

                                    &.show {
                                        opacity: 1;
                                        visibility: visible;
                                    }

                                    // 앱 화면은 폰 프레임 안에 세로로 넣는다
                                    &.media-layer-app {
                                        display: flex;
                                        align-items: flex-end;
                                        justify-content: center;
                                        padding-top: 14px;
                                        background: radial-gradient(
                                            circle at 50% 100%,
                                            #3c3c3c,
                                            var(--base-background) 70%
                                        );
                                    }
                                }

                                .slide-image {
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                }

                                .slide-image-app {
                                    display: block;
                                    height: 100%;
                                    aspect-ratio: 9 / 19.5;
                                    object-fit: cover;
                                    object-position: top;
                                    border: 3px solid #5a5a5a;
                                    border-bottom: 0;
                                    border-radius: 22px 22px 0 0;
                                }
                            }

                            .media-tabs {
                                position: absolute;
                                top: 12px;
                                right: 12px;
                                display: flex;
                                gap: 2px;
                                padding: 3px;
                                border-radius: var(--rounded-full);
                                background: rgb(20 20 20 / 70%);
                                backdrop-filter: blur(8px);

                                .media-tab {
                                    padding: 5px 12px;
                                    border: 0;
                                    border-radius: var(--rounded-full);
                                    background: none;
                                    color: var(--white);
                                    font-size: 12px;
                                    font-weight: 700;
                                    letter-spacing: 0.08em;
                                    cursor: pointer;
                                    transition:
                                        background-color 0.25s ease,
                                        color 0.25s ease,
                                        transform 0.2s ease;

                                    &:hover:not(.active) {
                                        background: rgb(255 255 255 / 12%);
                                    }

                                    &:active {
                                        transform: scale(0.94);
                                    }

                                    &.active {
                                        background: var(--white);
                                        color: var(--base-background);
                                    }

                                    &:focus-visible {
                                        outline: 2px solid var(--white);
                                        outline-offset: 2px;
                                    }
                                }
                            }
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
                                gap: 6px;
                            }

                            .toggle-period {
                                font-size: 12px;
                                font-weight: 600;
                                letter-spacing: 0.1em;
                                color: var(--primary);
                            }

                            .toggle-title {
                                font-size: 26px;
                                font-weight: 700;
                                letter-spacing: -0.01em;
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
                                gap: 20px;
                                text-align: left;
                                color: var(--white);
                            }

                            &.open .panel-inner {
                                padding-bottom: 24px;
                            }

                            .panel-summary {
                                padding-top: 20px;
                                border-top: 1px solid rgb(255 255 255 / 10%);
                                font-size: 15px;
                                line-height: 175%;
                                word-break: keep-all;
                                text-wrap: pretty;
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
                                    border: 1px solid rgb(255 255 255 / 18%);
                                    border-radius: var(--rounded-full);
                                    background: var(--base-background);
                                    font-size: 13px;
                                }
                            }

                            .panel-links {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 10px;
                            }

                            .panel-link {
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                                padding: 8px 16px;
                                border: 1px solid rgb(255 255 255 / 30%);
                                border-radius: var(--rounded-full);
                                color: var(--white);
                                font-size: 14px;
                                font-weight: 600;
                                text-decoration: none;
                                transition:
                                    background-color 0.25s ease,
                                    color 0.25s ease,
                                    transform 0.2s ease;

                                &::after {
                                    content: "↗" / "";
                                    transition: transform 0.25s ease;
                                }

                                &:hover {
                                    background: var(--white);
                                    color: var(--base-background);

                                    &::after {
                                        transform: translate(2px, -2px);
                                    }
                                }

                                &:active {
                                    transform: scale(0.96);
                                }

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
        .works .works-content .carousel .carousel-slide .slide-container {
            &.active {
                transform: none;
            }

            // 좁은 카드에서도 폰 화면이 작아지지 않도록 앱 화면이 있는 카드는 정사각형으로 키우고, 탭 아래로 내린다
            .slide-media.has-app .media-stage {
                aspect-ratio: 1;

                .media-layer-app {
                    padding-top: 52px;
                }
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .works * {
            transition-duration: 0.01ms !important;
        }
    }
</style>
