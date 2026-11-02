<template>
    <div class="works">
        <MainSectionTitle title="WORKS" no="03" />
        <div v-if="groups.length" class="works-groups">
            <section v-for="group in groups" :key="group.key" class="works-group">
                <h3 class="group-title">
                    {{ group.title }}
                    <span class="group-count">{{ group.items.length }}</span>
                </h3>
                <div class="works-content">
                    <UICarousel
                        :ref="(el): void => { carousels[group.key] = el as Carousel | undefined }"
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
                                @pointerdown="downX = $event.clientX"
                                @click="onCardClick($event, group.key, index)"
                            >
                                <div
                                    v-if="work.webImage"
                                    class="slide-media"
                                    :class="{ 'has-app': work.appImage }"
                                >
                                    <div
                                        class="media-stage"
                                        :class="{ zoomable: index === (selectedIndexes[group.key] ?? 0) }"
                                        :role="index === (selectedIndexes[group.key] ?? 0) ? 'button' : undefined"
                                        :tabindex="index === (selectedIndexes[group.key] ?? 0) ? 0 : undefined"
                                        :aria-label="index === (selectedIndexes[group.key] ?? 0) ? `${work.name} 이미지 크게 보기` : undefined"
                                        @click="onStageClick($event, group.key, index, work)"
                                        @keydown.enter.prevent="openViewer(work, $event.currentTarget as HTMLElement)"
                                    >
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
                                            :class="{ show: viewOf(work) === 'app', wide: work.appWide }"
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
                                    <div class="slide-head">
                                        <span class="head-text">
                                            <span class="head-period">{{ work.period }}</span>
                                            <span class="head-title">{{ work.name }}</span>
                                        </span>
                                    </div>
                                    <div class="slide-panel">
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
        <dialog
            ref="viewer"
            class="viewer"
            aria-label="이미지 크게 보기"
            @click="closeViewer"
            @cancel.prevent="closeViewer"
        >
            <img
                v-if="viewerImage"
                ref="viewerImg"
                :src="viewerImage.src"
                :alt="viewerImage.alt"
                :width="viewerImage.width"
                :height="viewerImage.height"
                class="viewer-image"
            />
            <button type="button" class="viewer-close" aria-label="닫기" @click="closeViewer">×</button>
        </dialog>
    </div>
</template>

<script setup lang="ts">
    import { companyWorks, sideWorks } from "~/data/works"
    import type { MainWorkData } from "~/structure/user"

    type MediaView = "web" | "app"

    interface Carousel {
        scrollTo: (index: number) => void
    }

    const views: MediaView[] = ["web", "app"]
    // 프로젝트가 없는 그룹은 섹션 자체를 숨긴다
    const groups = [
        { key: "company", title: "Company Projects", items: companyWorks },
        { key: "side", title: "Side Projects", items: sideWorks },
    ].filter((group): boolean => group.items.length > 0)

    // 그룹(캐러셀)마다 선택된 카드 번호
    const selectedIndexes = reactive<Record<string, number>>({})
    // 카드별 웹/앱 화면 선택. defaultView가 없으면 앱 화면이 있을 때 앱, 없으면 웹이 기본
    const viewMap = reactive<Record<string, MediaView>>({})

    const carousels: Record<string, Carousel | undefined> = {}

    // 클릭한 이미지를 화면 전체에 띄우는 모달 다이얼로그(Esc·포커스 가둠은 브라우저 기본 동작)
    const viewer = ref<HTMLDialogElement>()
    const viewerImg = ref<HTMLImageElement>()
    const viewerImage = ref<{ src: string; alt: string; width: number; height: number }>()
    // 열고 닫을 때 썸네일 위치와 크기를 오가는 애니메이션의 기준이 되는 원본 이미지
    let viewerOrigin: HTMLImageElement | undefined
    let closing = false

    // 드래그로 넘기고 손을 뗀 자리의 카드가 클릭으로 처리돼 되돌아가지 않도록 누른 위치를 기억한다
    let downX = 0

    // 옆 카드를 누르면 그쪽으로 넘긴다. 상세는 항상 펼쳐져 있다
    const onCardClick = (e: MouseEvent, key: string, index: number): void => {
        // 링크와 웹/앱 전환 버튼은 자기 동작만 한다
        if ((e.target as HTMLElement).closest("a, .media-tabs")) return
        // 키보드로 누른 클릭(detail 0)은 좌표가 없어 드래그 판정에서 제외한다
        if (e.detail > 0 && Math.abs(e.clientX - downX) > 5) return
        if (index !== (selectedIndexes[key] ?? 0)) carousels[key]?.scrollTo(index)
    }

    // 가운데(선택된) 카드의 이미지만 확대한다. 옆 카드는 카드 클릭 동작(넘기기)이 처리한다
    const onStageClick = (e: MouseEvent, key: string, index: number, work: MainWorkData): void => {
        if (index !== (selectedIndexes[key] ?? 0)) return
        if (e.detail > 0 && Math.abs(e.clientX - downX) > 5) return
        openViewer(work, e.currentTarget as HTMLElement)
    }

    // 썸네일의 위치·크기에서 확대된 위치·크기로(또는 반대로) 움직이는 애니메이션을 만든다
    const flip = (from: DOMRect, to: DOMRect, reverse: boolean): Promise<unknown> => {
        const moved = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`
        const frames = [{ transform: moved }, { transform: "none" }]
        return viewerImg.value!.animate(reverse ? frames.reverse() : frames, {
            duration: 320,
            easing: "cubic-bezier(0.32, 0.72, 0, 1)",
            fill: "both",
        }).finished
    }

    const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches

    const openViewer = async (work: MainWorkData, stage: HTMLElement): Promise<void> => {
        const isApp = viewOf(work) === "app"
        const src = isApp ? work.appImage : work.webImage
        const origin = stage.querySelector<HTMLImageElement>(".media-layer.show img")
        if (!src || !origin || !origin.naturalWidth) return
        // 화면(여백 24px 제외)에 비율을 유지한 채 가능한 한 크게 맞춘다
        const fit = Math.min(
            (innerWidth - 48) / origin.naturalWidth,
            (innerHeight - 48) / origin.naturalHeight,
        )
        viewerOrigin = origin
        closing = false
        viewerImage.value = {
            src,
            alt: `${work.name} ${isApp ? "앱" : "웹"} 화면`,
            width: Math.round(origin.naturalWidth * fit),
            height: Math.round(origin.naturalHeight * fit),
        }
        await nextTick()
        viewer.value?.showModal()
        if (!reducedMotion() && viewerImg.value) {
            await flip(origin.getBoundingClientRect(), viewerImg.value.getBoundingClientRect(), false)
        }
    }

    const closeViewer = async (): Promise<void> => {
        if (closing || !viewer.value?.open) return
        closing = true
        if (!reducedMotion() && viewerImg.value && viewerOrigin?.isConnected) {
            await flip(viewerOrigin.getBoundingClientRect(), viewerImg.value.getBoundingClientRect(), true)
        }
        viewer.value?.close()
        // 다음에 열 때 닫힌 상태(썸네일 크기)가 남아 깜빡이지 않도록 정리한다
        viewerImg.value?.getAnimations().forEach((animation): void => animation.cancel())
    }

    const viewOf = (work: MainWorkData): MediaView =>
        viewMap[work.name] ?? work.defaultView ?? (work.appImage ? "app" : "web")
</script>

<style lang="scss" scoped>
    .works {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        // 이미지 확대 보기: 배경(::backdrop)을 눌러도 닫힌다
        .viewer {
            width: 100vw;
            height: 100vh;
            max-width: none;
            max-height: none;
            margin: 0;
            padding: 24px;
            border: 0;
            background: transparent;
            align-items: center;
            justify-content: center;

            &[open] {
                display: flex;
            }

            &::backdrop {
                background: rgb(0 0 0 / 0%);
                transition: background-color 0.32s ease;
            }

            &[open]::backdrop {
                background: rgb(0 0 0 / 88%);

                @starting-style {
                    background: rgb(0 0 0 / 0%);
                }
            }

            // 크기는 열 때 화면에 맞춰 계산한 width·height 속성을 따른다(애니메이션 기준 위치가 정확하도록)
            .viewer-image {
                flex-shrink: 0;
                transform-origin: top left;
                border-radius: 8px;
                cursor: zoom-out;
            }

            .viewer-close {
                position: absolute;
                top: 16px;
                right: 20px;
                width: 40px;
                height: 40px;
                border: 1px solid var(--line);
                border-radius: 50%;
                background: var(--gray);
                color: var(--white);
                font-size: 22px;
                line-height: 1;
                cursor: pointer;
                transition:
                    transform 0.2s ease,
                    border-color 0.2s ease;

                &:hover {
                    border-color: var(--green);
                }

                &:active {
                    transform: scale(0.92);
                }
            }
        }

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

                .group-count {
                    margin-left: 6px;
                    font-size: 14px;
                    font-weight: 400;
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
                                // 큰 모니터에서 이미지가 화면을 채워 설명이 잘리지 않도록 높이를 제한한다
                                max-height: min(38vh, 360px);
                                // 위쪽 테두리와 이미지의 어두운 배경이 붙어 보이지 않도록 여백을 둔다
                                margin: 12px auto 0;
                                overflow: hidden;
                                opacity: 0.5;
                                transition: opacity 0.4s ease;

                                &.zoomable {
                                    cursor: zoom-in;
                                }
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

                                        &.wide {
                                            display: block;
                                            padding: 0;
                                            background: none;

                                            .slide-image-app {
                                                width: 100%;
                                                aspect-ratio: auto;
                                                border: 0;
                                                border-radius: 0;
                                                object-position: center;
                                            }
                                        }
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
                                top: 24px;
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

                        .slide-head {
                            width: 100%;
                            padding: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 16px;
                            color: var(--white);
                            text-align: left;

                            .head-text {
                                display: flex;
                                flex-direction: column;
                                gap: 6px;
                            }

                            .head-period {
                                font-family: var(--mono);
                                font-size: 12px;
                                letter-spacing: 0.05em;
                                color: var(--green);
                            }

                            .head-title {
                                font-size: 26px;
                                font-weight: 700;
                                letter-spacing: -0.01em;
                            }
                        }

                        .slide-panel {
                            .panel-inner {
                                padding: 0 24px 24px;
                                display: flex;
                                flex-direction: column;
                                gap: 20px;
                                text-align: left;
                                color: var(--white);
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
            // 세로로 쌓이는 폭에서는 선택된 카드가 따로 없으므로 모든 카드를 같은 모습으로 보여준다
            cursor: default;

            &,
            &.active {
                transform: none;
                border-color: var(--line);
            }

            .slide-media .media-stage {
                opacity: 1;
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

    // 320px 근처에서는 카드·패딩 때문에 상세 글 폭이 160px대로 좁아져 세로로 길어진다. 카드 폭을 넓히고 안쪽 여백을 줄여 글 폭을 확보한다
    @media (max-width: 480px) {
        .works .works-content .carousel .carousel-slide {
            flex-basis: 100%;
            padding: 20px 4px;

            .slide-container {
                .slide-head {
                    padding: 18px 16px;
                }

                .slide-panel .panel-inner {
                    padding: 0 16px 18px;
                    gap: 16px;
                }

                .panel-summary {
                    padding-top: 16px;
                    font-size: 14px;
                    line-height: 165%;
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
