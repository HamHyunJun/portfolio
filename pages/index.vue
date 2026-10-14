<template>
    <main class="main-page">
        <section class="section main-board">
            <div class="board-title">
                <h1 data-aos="fade-right" class="board-title-top">HAM</h1>
                <h1 data-aos="fade-left" class="board-title-bottom">HYUN JUN</h1>
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
                    desc: "SSR 및 파일 기반 라우팅을 활용한 웹 서비스를 개발하고 SEO를 최적화했습니다.",
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
                    name: "VS Code",
                    desc: "주요 개발 환경으로 활용하며 확장 프로그램을 통해 개발 생산성을 높였습니다.",
                    logoText: "VS",
                    logoColor: "#002AB5",
                    logoBackground: "#97ABEF",
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

                .board-title {
                    height: 100%;
                    font-size: clamp(48px, 12vw, 180px);
                    font-weight: 700;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .board-title-top {
                        text-align: left;
                    }

                    .board-title-bottom {
                        text-align: right;
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
