<template>
    <div class="works">
        <MainSectionTitle title="WORKS" no="03" />
        <div v-if="groups.length" class="works-groups">
            <section v-for="group in groups" :key="group.key" class="works-group">
                <h3 class="group-title">{{ group.title }}</h3>
                <div class="works-content">
                    <UICarousel
                        :ref="(el) => (carousels[group.key] = el as Carousel | null)"
                        class="carousel"
                        @change="selectedIndexes[group.key] = $event"
                    >
                        <UICarouselSlide
                            v-for="(work, index) in group.items"
                            :key="work.name"
                            class="carousel-slide"
                        >
                            <article
                                class="slide-container"
                                :class="{ active: index === (selectedIndexes[group.key] ?? 0) }"
                                @click="onCardClick($event, group.key, index)"
                            >
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
                                        :id="`work-toggle-${group.key}-${index}`"
                                        type="button"
                                        class="slide-toggle"
                                        :aria-expanded="!!openMap[group.key]"
                                        :aria-controls="`work-panel-${group.key}-${index}`"
                                    >
                                        <span class="toggle-text">
                                            <span class="toggle-period">{{ work.period }}</span>
                                            <span class="toggle-title">{{ work.name }}</span>
                                        </span>
                                    </button>
                                    <div
                                        :id="`work-panel-${group.key}-${index}`"
                                        class="slide-panel"
                                        :class="{ open: openMap[group.key] }"
                                        role="region"
                                        :aria-labelledby="`work-toggle-${group.key}-${index}`"
                                        :inert="!openMap[group.key]"
                                    >
                                        <div class="panel-inner">
                                            <p class="panel-summary">{{ work.summary }}</p>
                                            <ul class="panel-stack" aria-label="사용 기술">
                                                <li v-for="tech in work.stack" :key="tech">{{ tech }}</li>
                                            </ul>
                                            <ul
                                                v-if="work.aiTools?.length"
                                                class="panel-stack panel-ai"
                                                aria-label="사용한 AI 도구"
                                            >
                                                <li v-for="tool in work.aiTools" :key="tool">{{ tool }}</li>
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
            </section>
        </div>
        <p v-else class="works-empty">프로젝트를 준비하고 있습니다.</p>
    </div>
</template>

<script setup lang="ts">
    import { companyWorks, sideWorks } from "~/data/works"
    import type { MainWorkData } from "~/structure/user"

    type MediaView = "web" | "app"

    const views: MediaView[] = ["web", "app"]
    // 프로젝트가 없는 그룹은 섹션 자체를 숨긴다
    const groups = [
        { key: "company", title: "Company Projects", items: companyWorks },
        { key: "side", title: "Side Projects", items: sideWorks },
    ].filter((group) => group.items.length)

    // 그룹(캐러셀)마다 선택된 카드 번호
    const selectedIndexes = reactive<Record<string, number>>({})
    // 상세창 열림 상태는 그룹 안의 카드가 공유해, 넘겨도 열림/닫힘이 유지된다
    const openMap = reactive<Record<string, boolean>>({})
    // 카드별 웹/앱 화면 선택. 기본은 웹
    const viewMap = reactive<Record<string, MediaView>>({})

    type Carousel = { scrollTo: (index: number) => void }
    const carousels: Record<string, Carousel | null> = {}

    // 카드를 누르면 옆 카드는 그쪽으로 넘기고, 가운데 카드는 상세를 펼치거나 접는다
    const onCardClick = (e: MouseEvent, key: string, index: number): void => {
        // 링크와 웹/앱 전환 버튼은 자기 동작만 한다
        if ((e.target as HTMLElement).closest("a, .media-tabs")) return
        if (index === (selectedIndexes[key] ?? 0)) openMap[key] = !openMap[key]
        else carousels[key]?.scrollTo(index)
    }

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

        .works-groups {
            display: flex;
            flex-direction: column;
            gap: 56px;

            .group-title {
                margin-bottom: 20px;
                font-family: var(--mono);
                font-size: 18px;
                font-weight: 700;
                color: var(--white);

                &::before {
                    content: "// ";
                    color: var(--green);
                }
            }
        }

        .works-content {
            .carousel {
                .carousel-slide {
                    .slide-container {
                        height: 100%;
                        background: var(--gray);
                        border: 1px solid var(--line);
                        border-radius: 8px;
                        transform: scale(1);
                        transition:
                            transform 0.4s ease,
                            border-color 0.4s ease,
                            box-shadow 0.4s ease;
                        z-index: 0;
                        position: relative;
                        overflow: hidden;
                        cursor: pointer;

                        // hover: 테두리가 그린으로 밝아지고 화면이 또렷해진다. 옆 카드는 살짝 커지고, 가운데 카드는 그림자가 생긴다
                        &:hover {
                            border-color: rgb(63 185 80 / 60%);

                            .slide-media .media-stage {
                                opacity: 0.85;
                            }
                        }

                        &:not(.active):hover {
                            transform: scale(1.02);
                        }

                        &.active:hover {
                            box-shadow: 0 20px 40px -24px rgb(63 185 80 / 45%);
                        }

                        &.active {
                            transform: scale(1.05);
                            z-index: 1;
                            border-color: var(--green);

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
                                font-family: var(--mono);
                                font-size: 12px;
                                letter-spacing: 0.05em;
                                color: var(--green);
                            }

                            .toggle-title {
                                font-size: 26px;
                                font-weight: 700;
                                letter-spacing: -0.01em;
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
                                    border-radius: 4px;
                                    background: var(--base-background);
                                    font-family: var(--mono);
                                    font-size: 12px;
                                }
                            }

                            // 기술 스택과 구분되는 AI 도구 줄: 그린 점선 칩 + "AI TOOLS" 라벨
                            .panel-ai {
                                align-items: center;

                                &::before {
                                    content: "AI TOOLS";
                                    margin-right: 4px;
                                    font-family: var(--mono);
                                    font-size: 11px;
                                    letter-spacing: 0.1em;
                                    color: var(--primary);
                                }

                                li {
                                    border: 1px dashed var(--green);
                                    color: var(--green);
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
                                border: 1px solid var(--line);
                                border-radius: 4px;
                                color: var(--white);
                                font-family: var(--mono);
                                font-size: 13px;
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

            // 웹/앱 카드 모두 같은 비율로 맞춰 카드 높이를 통일한다. 4:3이면 웹 화면은 좌우만 조금 잘리고, 폰 화면도 너무 작아지지 않는다
            .slide-media .media-stage {
                aspect-ratio: 4 / 3;

                .media-layer-app {
                    padding-top: 44px;
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
