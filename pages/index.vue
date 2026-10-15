<template>
    <main class="main-page">
        <section class="section main-board">
            <div class="board-lines" aria-hidden="true">
                <span
                    v-for="(top, n) in [18, 36, 64, 82]"
                    :key="top"
                    :style="{ top: `${top}%`, '--n': n }"
                ></span>
            </div>
            <div class="board-bar" aria-hidden="true">
                <i></i><i></i><i></i>
                <span>~/portfolio — zsh</span>
            </div>
            <div class="board-title">
                <h1 class="board-name" aria-label="HAM HYUN JUN">
                    <span
                        v-for="(line, row) in nameLines"
                        :key="row"
                        class="board-line"
                        :class="row ? 'board-title-bottom' : 'board-title-top'"
                        aria-hidden="true"
                    >
                        <span v-for="(word, w) in line" :key="w" class="board-word">
                            <span
                                v-for="{ char, i } in word"
                                :key="i"
                                class="board-char"
                                :style="{ '--i': i + row * 4 }"
                            >
                                {{ char }}
                            </span>
                        </span>
                    </span>
                </h1>
                <p class="sr-only">Front-End Developer</p>
                <div class="board-code" aria-hidden="true">
                    <p
                        v-for="(line, n) in codeLines"
                        :key="n"
                        class="code-line"
                        :style="{ '--len': line.len, '--delay': `${line.delay}ms` }"
                    >
                        <span v-for="(t, k) in line.tokens" :key="k" :class="t.type">{{ t.text }}</span>
                    </p>
                    <p class="code-prompt" :style="{ '--delay': `${promptDelay}ms` }">
                        <span class="ps">$ </span><span class="code-cursor"></span>
                    </p>
                </div>
            </div>
        </section>
        <div class="main-contents">
            <MainAside
                class="main-aside"
                :files="files"
                :active-section="activeSection"
                @select="scrollToSection"
            />
            <div class="main-editor">
                <MainTabs
                    class="main-tabs"
                    :files="files"
                    :active-section="activeSection"
                    @select="scrollToSection"
                />
                <div class="editor-body">
                    <div class="gutter" aria-hidden="true">
                        <span v-for="n in lineCount" :key="n">{{ n }}</span>
                    </div>
                    <div ref="contentRef" class="main-content-wrap">
                        <section ref="aboutRef" class="section main-about">
                            <MainAbout :about-data="aboutData" />
                        </section>
                        <section ref="skillRef" class="section main-skill">
                            <MainSkill :skill-data="skillData" />
                        </section>
                        <section ref="worksRef" class="section main-works">
                            <MainWorks />
                        </section>
                        <section class="section main-contact">
                            <MainContact />
                        </section>
                    </div>
                </div>
            </div>
        </div>
        <MainStatusBar :file="activeFile.name" :line="line" />
    </main>
</template>

<script setup lang="ts">
    import type { MainAboutData, MainSkillData, NavFile, SectionKey } from "~/structure/user"
    import AOS from "aos"
    import "aos/dist/aos.css"

    useHead({ htmlAttrs: { lang: "ko" } })
    useSeoMeta({
        title: "HAM HYUN JUN | Front-End Developer",
        description: "프론트엔드 개발자 HAM HYUN JUN의 포트폴리오. 경력, 기술 스택, 프로젝트를 소개합니다.",
    })

    definePageMeta({
        layout: "default",
    })

    let lenis: any
    let lenisRafId = 0
    let sectionObserver: IntersectionObserver | null = null
    let sizeObserver: ResizeObserver | null = null
    let scrollRafId = 0

    // 단어 단위로 줄바꿈되도록 단어별로 묶고, 글자 인덱스(공백 포함)는 진입 딜레이용으로 유지
    const nameLines = ["HAM", "HYUN JUN"].map((line) => {
        let i = 0
        return line.split(" ").map((word) => {
            const chars = [...word].map((char) => ({ char, i: i++ }))
            i++
            return chars
        })
    })

    type Token = { type: "ps" | "kw" | "fn" | "str" | "prop" | "dim"; text: string }

    // 한 글자당 40ms로 한 줄씩 타이핑. 폭은 ch 단위라 글자 수와 정확히 맞는다
    const codeSource: Token[][] = [
        [
            { type: "ps", text: "$ " },
            { type: "fn", text: "whoami" },
        ],
        [
            { type: "kw", text: "const " },
            { type: "prop", text: "developer " },
            { type: "dim", text: "= {" },
        ],
        [
            { type: "dim", text: "  role: " },
            { type: "str", text: '"Front-End Developer"' },
            { type: "dim", text: "," },
        ],
        [
            { type: "dim", text: "  stack: [" },
            { type: "str", text: '"Vue"' },
            { type: "dim", text: ", " },
            { type: "str", text: '"Nuxt"' },
            { type: "dim", text: ", " },
            { type: "str", text: '"TypeScript"' },
            { type: "dim", text: "]," },
        ],
        [{ type: "dim", text: "}" }],
    ]
    let codeDelay = 1100
    const codeLines = codeSource.map((tokens) => {
        const len = tokens.reduce((sum, t) => sum + t.text.length, 0)
        const line = { tokens, len, delay: codeDelay }
        codeDelay += len * 40 + 150
        return line
    })

    // 타이핑이 모두 끝난 뒤 깜빡이는 프롬프트가 나타난다
    const promptDelay = codeDelay

    // 탐색기·탭·상태바가 같이 쓰는 파일 목록
    const files: NavFile[] = [
        { key: "about", name: "about.md", glyph: "M↓", color: "#79c0ff" },
        { key: "skill", name: "skills.json", glyph: "{}", color: "#e3b341" },
        { key: "works", name: "works.tsx", glyph: "TS", color: "#3178c6" },
    ]

    const LINE_HEIGHT = 24

    const activeSection = ref<SectionKey | null>(null)
    const contentRef = ref<HTMLElement | null>(null)
    const lineCount = ref(0)
    const line = ref(1)
    const activeFile = computed(() => files.find((f) => f.key === activeSection.value) ?? files[0])
    const aboutRef = ref<HTMLElement | null>(null)
    const skillRef = ref<HTMLElement | null>(null)
    const worksRef = ref<HTMLElement | null>(null)

    const aboutData = computed<MainAboutData>(() => ({
        education: [
            { date: "2016. 02.", detail: "효원고등학교 졸업" },
            { date: "2021. 02.", detail: "오산대학교 스마트IT과 졸업" },
        ],
        awards: [
            { date: "2017. 06.", detail: "Mos PowerPoint 2급" },
            { date: "2017. 06.", detail: "Mos Exel 2급" },
            {
                date: "2017. 11.",
                detail: "대학생 디지털 솔루션 챌린지(K-Hackathon) 워크숍 우수상 수상",
            },
            { date: "2020. 06.", detail: "LINC+ 진로 설계 경진대회 장려상 수상" },
            { date: "2020. 10.", detail: "LINC+ 현장실습 수기 공모전 최우수상 수상" },
            { date: "2020. 11.", detail: "교내 창업 아이디어 경진대회 우수상 수상" },
        ],
        works: [
            { date: "2024. 04. ~", detail: "크리에이블 개발팀 근무중" },
            { date: "2023. 11. ~ 2024. 02.", detail: "오케스트로 Platform Dev3팀 근무" },
            { date: "2022. 03. ~ 2023. 08.", detail: "아이오비 플랫폼 개발팀 근무" },
            { date: "2020. 12. ~ 2022. 03.", detail: "중외정보기술 S&P 사업팀 근무" },
        ],
    }))

    const skillData = computed<MainSkillData[]>(() => [
        {
            category: "Languages",
            data: [
                {
                    name: "TypeScript",
                    desc: "타입 기반으로 안정적인 컴포넌트와 API 인터페이스를 설계하고 개발했습니다.",
                    logoText: "TS",
                    logoColor: "#002AB5",
                    logoBackground: "#97ABEF",
                },
                {
                    name: "JavaScript",
                    desc: "ES6+ 문법을 활용하여 동적인 UI와 비즈니스 로직을 구현했습니다.",
                    logoText: "JS",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "HTML5",
                    desc: "시맨틱 마크업을 기반으로 접근성과 SEO를 고려한 화면을 구성했습니다.",
                    logoText: "HT",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
                {
                    name: "CSS3",
                    desc: "반응형 레이아웃과 다양한 애니메이션 및 스타일을 구현했습니다.",
                    logoText: "CS",
                    logoColor: "#002AB5",
                    logoBackground: "#97ABEF",
                },
            ],
        },
        {
            category: "Frameworks & Libraries",
            data: [
                {
                    name: "Vue.js",
                    desc: "Composition API를 활용하여 재사용 가능한 컴포넌트를 설계하고 개발했습니다.",
                    logoText: "VU",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Nuxt.js",
                    desc: "Nuxt 3·4의 SSR과 파일 기반 라우팅으로 웹 서비스를 개발하고 SEO를 최적화했습니다.",
                    logoText: "NX",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Pinia",
                    desc: "전역 상태를 관리하고 컴포넌트 간 데이터 흐름을 효율적으로 구성했습니다.",
                    logoText: "PI",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "Tailwind CSS",
                    desc: "Utility-First 방식으로 반응형 UI를 빠르게 구현했습니다.",
                    logoText: "TW",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "SCSS",
                    desc: "변수, 믹스인, 중첩 문법을 활용하여 유지보수가 쉬운 스타일을 작성했습니다.",
                    logoText: "SC",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
                {
                    name: "Supabase",
                    desc: "DB와 백엔드를 Supabase로 구성해 Camping&Joy, MoaCook을 개발했습니다.",
                    logoText: "SB",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Capacitor",
                    desc: "Nuxt 웹 서비스를 Android·iOS 앱으로 패키징해 배포했습니다.",
                    logoText: "CP",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "ECharts",
                    desc: "데이터를 시각화하는 차트와 대시보드를 구현했습니다.",
                    logoText: "EC",
                    logoColor: "#7F0048",
                    logoBackground: "#F28DC6",
                },
            ],
        },
        {
            category: "Tools",
            data: [
                {
                    name: "GitHub",
                    desc: "Git Flow 기반으로 버전 관리 및 협업을 진행했습니다.",
                    logoText: "GH",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
                },
                {
                    name: "Figma",
                    desc: "디자이너와 협업하며 디자인 시안을 기반으로 화면을 구현했습니다.",
                    logoText: "FG",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "Claude Code (LLM)",
                    desc: "LLM 에이전트를 개발 워크플로에 활용하고, MCP 기반 도구(Inspector-Agent)를 직접 만들었습니다.",
                    logoText: "AI",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "Vercel",
                    desc: "Nuxt 서비스를 Vercel에 배포하고 프리뷰·운영 환경을 관리했습니다.",
                    logoText: "VC",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
                },
                {
                    name: "Vite",
                    desc: "빠른 개발 서버와 빌드 환경을 활용하여 프로젝트를 구성했습니다.",
                    logoText: "VI",
                    logoColor: "#0121C2",
                    logoBackground: "#9FABE3",
                },
            ],
        },
    ])

    const sectionRefs = {
        about: aboutRef,
        skill: skillRef,
        works: worksRef,
    } as const

    const scrollToSection = (key: SectionKey): void => {
        const target = sectionRefs[key].value
        if (!target) return

        if (lenis) {
            lenis.scrollTo(target)
        } else {
            target.scrollIntoView({ behavior: "smooth" })
        }
    }

    onBeforeUnmount(() => {
        lenis?.destroy()
        cancelAnimationFrame(lenisRafId)
        sectionObserver?.disconnect()
        sizeObserver?.disconnect()
        cancelAnimationFrame(scrollRafId)
        window.removeEventListener("scroll", onScroll)
    })

    // 스크롤 위치를 에디터의 "Ln N"으로 환산해 상태바에 보여 준다
    const onScroll = (): void => {
        cancelAnimationFrame(scrollRafId)
        scrollRafId = requestAnimationFrame(() => {
            line.value = Math.floor(window.scrollY / LINE_HEIGHT) + 1
        })
    }

    onMounted(() => {
        AOS.init()

        // 에디터 높이에 맞춰 줄 번호 개수를 정한다
        sizeObserver = new ResizeObserver(([entry]) => {
            lineCount.value = Math.floor(entry.contentRect.height / LINE_HEIGHT)
        })
        if (contentRef.value) sizeObserver.observe(contentRef.value)
        window.addEventListener("scroll", onScroll, { passive: true })

        ensureLenis().then(() => {
            lenis = new window.Lenis({ duration: 1.0, smoothWheel: true })

            const lenisRaf = (time: number): void => {
                lenis.raf(time)
                lenisRafId = requestAnimationFrame(lenisRaf)
            }
            lenisRafId = requestAnimationFrame(lenisRaf)
        })

        const sectionMap = new Map<Element, SectionKey>([
            [aboutRef.value as Element, "about"],
            [skillRef.value as Element, "skill"],
            [worksRef.value as Element, "works"],
        ])

        sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeSection.value = sectionMap.get(entry.target) ?? null
                    }
                })
            },
            { rootMargin: "-20% 0px -75% 0px" }
        )

        sectionMap.forEach((_key, el) => el && sectionObserver?.observe(el))
    })

    const ensureLenis = (): Promise<void> =>
        new Promise<void>((resolve, reject) => {
            if (window.Lenis) return resolve()

            let script = document.querySelector<HTMLScriptElement>('script[src*="lenis.min.js"]')
            if (!script) {
                script = document.createElement("script")
                script.src = "https://unpkg.com/lenis@1.3.8/dist/lenis.min.js"
                script.async = true
                document.head.appendChild(script)
            }
            script.addEventListener("load", () => resolve(), { once: true })
            script.addEventListener("error", () => reject(new Error("Lenis load failed")), {
                once: true,
            })
        })
</script>

<style lang="scss" scoped>
    @keyframes char-rise {
        from {
            transform: translateY(105%);
        }
    }

    @keyframes line-in {
        from {
            transform: translateX(calc(var(--dir, 1) * -100%));
        }
    }

    // 대기 구간을 끝에 둬서 첫 빛줄기가 지연 없이 바로 출발한다
    @keyframes line-streak {
        0% {
            left: -20%;
        }

        60%,
        100% {
            left: 100%;
        }
    }

    @keyframes line-streak-reverse {
        0% {
            left: 100%;
        }

        60%,
        100% {
            left: -20%;
        }
    }

    @keyframes type {
        from {
            width: 0;
        }
    }

    @keyframes show {
        from {
            opacity: 0;
        }
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .board-char,
        .code-line,
        .code-prompt,
        .code-cursor,
        .board-lines span,
        .board-lines span::after {
            animation: none !important;
        }
    }

    .main-page {
        .section {
            position: relative;
            padding: 120px 60px;
            background: var(--base-background);

            &.main-board {
                height: 100vh;
                margin: auto 0;
                background:
                    radial-gradient(60% 50% at 85% 10%, rgb(63 185 80 / 10%), transparent 70%),
                    radial-gradient(50% 40% at 5% 95%, rgb(63 185 80 / 6%), transparent 70%),
                    var(--base-background);
                position: sticky;
                top: 10px;

                // 얇은 가로선이 방향을 번갈아 가며 쭉 들어온 뒤, 빛줄기가 선을 따라 지나간다
                .board-lines {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;

                    // 가장자리로 갈수록 옅어지는 점 격자
                    &::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(rgb(255 255 255 / 12%) 1px, transparent 1px)
                            0 0 / 32px 32px;
                        mask-image: radial-gradient(70% 70% at 50% 50%, #000, transparent);
                    }

                    span {
                        position: absolute;
                        left: 0;
                        width: 100%;
                        height: 1px;
                        overflow: hidden;
                        background: rgb(63 185 80 / 18%);
                        animation: line-in 1.8s cubic-bezier(0.22, 1, 0.36, 1) both;
                        animation-delay: calc(var(--n) * 150ms);

                        &::after {
                            content: "";
                            position: absolute;
                            top: 0;
                            width: 18%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgb(63 185 80 / 70%));
                            animation: line-streak 7s ease-in-out infinite;
                            animation-delay: calc(var(--n) * 0.25s + 0.7s);
                            left: -20%;
                        }

                        &:nth-child(even) {
                            --dir: -1;

                            &::after {
                                animation-name: line-streak-reverse;
                                // 오른쪽→왼쪽으로 갈 때는 밝은 머리가 왼쪽, 꼬리가 오른쪽
                                background: linear-gradient(
                                    270deg,
                                    transparent,
                                    rgb(63 185 80 / 70%)
                                );
                            }
                        }
                    }
                }

                // 에디터 창 제목 줄
                .board-bar {
                    position: absolute;
                    right: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    padding: 12px 60px;
                    font-family: var(--mono);
                    font-size: 12px;
                    color: var(--primary);

                    * {
                        font-family: var(--mono);
                    }
                }

                .board-bar {
                    top: 0;
                    gap: 8px;
                    border-bottom: 1px solid var(--line);

                    i {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #ff5f56;

                        &:nth-child(2) {
                            background: #ffbd2e;
                        }

                        &:nth-child(3) {
                            background: #27c93f;
                        }
                    }

                    span {
                        margin-left: 12px;
                    }
                }

                .board-title {
                    position: relative;
                    height: 100%;
                    font-size: clamp(48px, 12vw, 180px);
                    font-weight: 700;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .board-name {
                        font: inherit;
                    }

                    .board-line {
                        display: block;
                        overflow: hidden;
                    }

                    .board-word {
                        display: inline-block;
                        white-space: nowrap;

                        & + .board-word {
                            margin-left: 0.25em;
                        }
                    }

                    .board-title-top {
                        text-align: left;
                    }

                    .board-title-bottom {
                        text-align: right;
                    }

                    // 글자가 아래에서 위로 한 글자씩 올라오는 진입 효과
                    .board-char {
                        display: inline-block;
                        // 두 줄 모두 속이 빈 아웃라인
                        color: transparent;
                        -webkit-text-stroke: 1.5px var(--white);
                        animation: char-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
                        animation-delay: calc(var(--i) * 70ms + 150ms);
                    }

                    // 터미널에 한 줄씩 타이핑되는 코드 블록 (JS 없이 CSS steps로 구현)
                    .board-code {
                        width: fit-content;
                        margin: 32px 0 0 auto;
                        padding: 16px 20px;
                        background: rgb(22 27 34 / 85%);
                        border: 1px solid var(--line);
                        border-radius: 8px;
                        font-size: clamp(11px, 1.1vw, 15px);

                        &,
                        * {
                            font-family: var(--mono);
                        }

                        p {
                            margin: 0;
                            line-height: 1.8;
                            white-space: pre;
                        }

                        .code-line {
                            width: calc(var(--len) * 1ch);
                            overflow: hidden;
                            animation: type calc(var(--len) * 40ms) steps(var(--len)) both;
                            animation-delay: var(--delay);
                        }

                        .code-prompt {
                            animation: show 0s var(--delay) both;
                        }

                        .code-cursor {
                            display: inline-block;
                            width: 0.6em;
                            height: 1.1em;
                            vertical-align: text-bottom;
                            background: var(--green);
                            animation: blink 1.1s steps(1) infinite;
                        }

                        .ps {
                            color: var(--green);
                        }

                        .kw {
                            color: #ff7b72;
                        }

                        .fn {
                            color: var(--purple);
                        }

                        .str {
                            color: var(--blue);
                        }

                        .prop {
                            color: var(--orange);
                        }

                        .dim {
                            color: var(--primary);
                        }
                    }

                    .sr-only {
                        position: absolute;
                        width: 1px;
                        height: 1px;
                        overflow: hidden;
                        clip-path: inset(50%);
                        white-space: nowrap;
                    }
                }
            }

            &.main-about {
                height: 100vh;
            }

            &.main-contact:not(:has(*)) {
                display: none;
            }
        }

        .main-contents {
            display: flex;
            position: relative;

            .main-aside {
                width: 250px;
                height: 100vh;
                flex-shrink: 0;
                align-self: flex-start;
                position: sticky;
                top: 10px;
            }

            .main-editor {
                min-width: 0;
                flex: 1;

                .main-tabs {
                    position: sticky;
                    top: 0;
                    z-index: 5;
                }

                .editor-body {
                    display: flex;
                }

                // 줄 번호 거터
                .gutter {
                    flex: 0 0 56px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border-right: 1px solid var(--line);
                    background: var(--base-background);
                    font-family: var(--mono);
                    font-size: 12px;
                    color: #484f58;
                    user-select: none;

                    span {
                        flex: 0 0 24px;
                        padding-right: 16px;
                        font-family: var(--mono);
                        line-height: 24px;
                        text-align: right;
                    }
                }

                .main-content-wrap {
                    min-width: 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
            }
        }

        // 하단 고정 상태바가 마지막 내용을 가리지 않게 한다
        padding-bottom: 26px;

        @media (max-width: 768px) {
            .section {
                padding: 60px 20px;

                &.main-board .board-title {
                    font-size: clamp(48px, 18vw, 120px);
                }

                &.main-board .board-bar {
                    padding: 12px 20px;
                }

                &.main-board .board-code {
                    font-size: 11px;
                }

                &.main-about {
                    height: auto;
                }
            }

            .main-contents {
                .main-aside {
                    width: 100%;
                    height: auto;
                    position: fixed;
                    top: auto;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 10;
                }

                .main-editor .gutter {
                    display: none;
                }

                .main-editor .main-content-wrap {
                    padding-bottom: 64px;
                }
            }
        }
    }
</style>
