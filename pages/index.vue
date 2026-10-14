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
            <div class="board-title">
                <h1 class="board-name" aria-label="HAM HYUN JUN">
                    <span
                        v-for="(line, row) in nameLines"
                        :key="line"
                        class="board-line"
                        :class="row ? 'board-title-bottom' : 'board-title-top'"
                        aria-hidden="true"
                    >
                        <span
                            v-for="(char, i) in line"
                            :key="i"
                            class="board-char"
                            :style="{ '--i': i + row * 4 }"
                        >
                            {{ char === " " ? "\u00A0" : char }}
                        </span>
                    </span>
                </h1>
                <p class="board-role">Front-End Developer</p>
            </div>
        </section>
        <div class="main-contents">
            <MainAside
                class="main-aside"
                :active-section="activeSection"
                @select="scrollToSection"
            />
            <div class="main-content-wrap">
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
    </main>
</template>

<script setup lang="ts">
    import type { MainAboutData, MainSkillData } from "~/structure/user"
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

    const nameLines = ["HAM", "HYUN JUN"]

    type SectionKey = "about" | "skill" | "works"

    const activeSection = ref<SectionKey | null>(null)
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
    })

    onMounted(() => {
        AOS.init()

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

    @keyframes line-streak {
        0%,
        40% {
            left: -20%;
        }

        100% {
            left: 100%;
        }
    }

    @keyframes role-fade {
        from {
            opacity: 0;
            letter-spacing: 0.8em;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .board-char,
        .board-role,
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
                position: sticky;
                top: 10px;

                // 얇은 가로선이 방향을 번갈아 가며 쭉 들어온 뒤, 빛줄기가 선을 따라 지나간다
                .board-lines {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;

                    span {
                        position: absolute;
                        left: 0;
                        width: 100%;
                        height: 1px;
                        overflow: hidden;
                        background: rgb(255 255 255 / 10%);
                        animation: line-in 1.8s cubic-bezier(0.22, 1, 0.36, 1) both;
                        animation-delay: calc(var(--n) * 150ms);

                        &::after {
                            content: "";
                            position: absolute;
                            top: 0;
                            width: 18%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgb(255 255 255 / 55%));
                            animation: line-streak 7s ease-in-out infinite;
                            animation-delay: calc(var(--n) * 1.4s + 1.8s);
                            left: -20%;
                        }

                        &:nth-child(even) {
                            --dir: -1;

                            &::after {
                                animation-direction: reverse;
                            }
                        }
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

                    .board-title-top {
                        text-align: left;
                    }

                    .board-title-bottom {
                        text-align: right;
                    }

                    // 글자가 아래에서 위로 한 글자씩 올라오는 진입 효과
                    .board-char {
                        display: inline-block;
                        animation: char-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
                        animation-delay: calc(var(--i) * 70ms + 150ms);
                    }

                    .board-role {
                        margin-top: 24px;
                        font-size: clamp(14px, 1.6vw, 22px);
                        font-weight: 400;
                        letter-spacing: 0.4em;
                        text-align: right;
                        color: var(--primary);
                        animation: role-fade 1s ease 1.1s both;
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
                background: var(--base-background);
                position: sticky;
                top: 10px;
            }

            .main-content-wrap {
                min-width: 0;
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }

        @media (max-width: 768px) {
            .section {
                padding: 60px 20px;

                &.main-board .board-title {
                    font-size: clamp(48px, 18vw, 120px);
                }

                &.main-about {
                    height: auto;
                    min-height: 100vh;
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

                .main-content-wrap {
                    padding-bottom: 64px;
                }
            }
        }
    }
</style>
