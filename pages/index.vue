<template>
    <main class="main-page">
        <div ref="progressRef" class="progress" aria-hidden="true"></div>
        <header class="print-head" aria-hidden="true">
            <p class="print-name">HAM HYUN JUN</p>
            <p class="print-role">Front-End Developer</p>
        </header>
        <section class="section main-board" @pointermove="onBoardMove">
            <div class="board-glow" aria-hidden="true"></div>
            <div class="board-lines" aria-hidden="true">
                <span
                    v-for="(top, n) in [18, 36, 64, 82]"
                    :key="top"
                    :style="{ top: `${top}%`, '--n': n }"
                ></span>
            </div>
            <div class="board-bar" aria-hidden="true">
                <i></i><i></i><i></i>
                <p>~/portfolio — zsh</p>
            </div>
            <div class="board-title">
                <p class="board-ticker" aria-hidden="true">
                    <span>&lt;</span>
                    <span class="ticker-window">
                        <span class="ticker-list">
                            <span v-for="(word, n) in tickerWords" :key="n">{{ word }}</span>
                        </span>
                    </span>
                    <span>/&gt;</span>
                </p>
                <h1
                    ref="nameRef"
                    class="board-name"
                    aria-label="HAM HYUN JUN"
                    @pointerenter="scrambleName(false)"
                >
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
                        <p v-for="n in lineCount" :key="n">{{ n }}</p>
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
                        <section ref="contactRef" class="section main-contact">
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
    import { contacts } from "~/data/contacts"
    import "aos/dist/aos.css"

    definePageMeta({
        layout: "default",
    })

    interface Token {
        type: "ps" | "kw" | "fn" | "str" | "prop" | "dim"
        text: string
    }

    interface CodeLine {
        tokens: Token[]
        len: number
        delay: number
    }

    interface NameChar {
        char: string
        i: number
    }

    let lenis: any
    let lenisRafId = 0
    let sizeObserver: ResizeObserver | undefined
    let scrollRafId = 0

    // 단어 단위로 줄바꿈되도록 단어별로 묶고, 글자 인덱스(공백 포함)는 진입 딜레이용으로 유지
    const nameLines = ["HAM", "HYUN JUN"].map((line): NameChar[][] => {
        let i = 0
        return line.split(" ").map((word): NameChar[] => {
            const chars = [...word].map((char): NameChar => ({ char, i: i++ }))
            i++
            return chars
        })
    })

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
    const codeLines = codeSource.map((tokens): CodeLine => {
        const len = tokens.reduce((sum, t): number => sum + t.text.length, 0)
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
        // 연락처가 비어 있으면 섹션 자체가 렌더링되지 않으므로 파일도 숨긴다
        ...(contacts.length
            ? [{ key: "contact", name: "contact.sh", glyph: "SH", color: "#d2a8ff" } as const]
            : []),
    ]

    const LINE_HEIGHT = 24
    const GLYPHS = "01<>/{}[]#$%&*"
    let scrambling = false

    // 히어로 라벨에서 순서대로 바뀌는 단어. 끝의 첫 단어 복사본이 무한 루프를 이어 준다
    const tickerWords = ["Front-End", "Vue", "Nuxt", "TypeScript", "Front-End"]

    const activeSection = ref<SectionKey>()
    const contentRef = ref<HTMLElement>()
    const progressRef = ref<HTMLElement>()
    const nameRef = ref<HTMLElement>()
    const lineCount = ref(0)
    const line = ref(1)
    const aboutRef = ref<HTMLElement>()
    const skillRef = ref<HTMLElement>()
    const worksRef = ref<HTMLElement>()
    const contactRef = ref<HTMLElement>()

    const sectionRefs = {
        about: aboutRef,
        skill: skillRef,
        works: worksRef,
        contact: contactRef,
    } as const

    onBeforeUnmount((): void => {
        lenis?.destroy()
        cancelAnimationFrame(lenisRafId)
        sizeObserver?.disconnect()
        cancelAnimationFrame(scrollRafId)
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("wheel", releasePending)
        window.removeEventListener("touchstart", releasePending)
        window.removeEventListener("keydown", releasePending)
    })

    onMounted((): void => {
        AOS.init({ once: true, disable: prefersReducedMotion })
        scrambleName(true)

        // 에디터 높이에 맞춰 줄 번호 개수를 정한다
        sizeObserver = new ResizeObserver(([entry]): void => {
            lineCount.value = Math.floor(entry.contentRect.height / LINE_HEIGHT)
        })
        if (contentRef.value) sizeObserver.observe(contentRef.value)
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("wheel", releasePending, { passive: true })
        window.addEventListener("touchstart", releasePending, { passive: true })
        window.addEventListener("keydown", releasePending)

        ensureLenis().then((): void => {
            lenis = new window.Lenis({ duration: 1.0, smoothWheel: true })

            const lenisRaf = (time: number): void => {
                lenis.raf(time)
                lenisRafId = requestAnimationFrame(lenisRaf)
            }
            lenisRafId = requestAnimationFrame(lenisRaf)
        })

        updateActiveSection()
    })

    const activeFile = computed((): NavFile => files.find((f): boolean => f.key === activeSection.value) ?? files[0])

    const aboutData = computed((): MainAboutData => ({
        education: [
            { date: "2016. 02.", detail: "효원고등학교 졸업" },
            { date: "2021. 02.", detail: "오산대학교 스마트IT과 졸업" },
        ],
        awards: [
            {
                date: "2017. 11.",
                detail: "대학생 디지털 솔루션 챌린지(K-Hackathon) 워크숍 우수상 수상",
            },
            { date: "2020. 06.", detail: "LINC+ 진로 설계 경진대회 장려상 수상" },
            { date: "2020. 10.", detail: "LINC+ 현장실습 수기 공모전 최우수상 수상" },
            { date: "2020. 11.", detail: "교내 창업 아이디어 경진대회 우수상 수상" },
        ],
        works: [
            {
                date: "2020. 12. ~ 2022. 03.",
                detail: "중외정보기술 S&P 사업팀 근무",
                points: [
                    "제주 5G 기반 스마트 노인복지 신사업 현장 운영 및 인프라 관리",
                    "복지 IoT 디바이스 모니터링 및 주기적인 원격 데이터 정합성 검증",
                    "장애 징후 선제 대응 및 기기 유지보수를 통해 서비스 운영 안정성 확보",
                ],
            },
            {
                date: "2022. 03. ~ 2023. 08.",
                detail: "아이오비 플랫폼 개발팀 근무",
                points: [
                    "복잡한 건강 측정 결과 및 테스트 데이터를 직관적인 수치 지표와 인터랙티브 테이블로 시각화",
                    "시스템 실행 로그 조회 및 모니터링 뷰를 구현해 데이터 추적성 및 관리 효율성 개선",
                ],
            },
            {
                date: "2023. 11. ~ 2024. 02.",
                detail: "오케스트로 Platform Dev3팀 근무",
                points: [
                    "엔터프라이즈 B2B 클라우드/인프라 관리 플랫폼 대시보드 프론트엔드 운영 및 고도화",
                    "고객사별 요구사항에 맞춘 커스텀 위젯 및 대시보드 UI 모듈화 구조 설계",
                    "반복적인 SI성 커스터마이징 비용을 절감할 수 있도록 화면 설정 및 데이터 매핑 로직 표준화",
                ],
            },
            {
                date: "2024. 04. ~",
                detail: "크리에이블 개발팀 근무중",
                points: [
                    "자사 주요 서비스(짤스튜디오, 고고고, 사운드 아카이브) 프론트엔드 개발",
                    "신규 사용자 유입을 위한 고전환 랜딩 페이지 및 프로모션 이벤트 페이지 구현",
                    "레거시 UI 리뉴얼과 컴포넌트 리팩토링을 진행해 코드 재사용성 및 렌더링 성능 최적화",
                ],
            },
        ],
    }))

    const skillData = computed((): MainSkillData[] => [
        {
            category: "Languages",
            data: [
                {
                    name: "TypeScript",
                    desc:
                        "자바스크립트에 \"이 값은 숫자, 이 값은 이런 모양의 객체\"라는 타입을 미리 적어, 코드를 실행하기 전에 실수를 잡는 언어입니다. ClaudeBoard에서는 서버와 화면이 주고받는 메시지(세션 상태 5종, 요청·응답 종류 등)를 하나의 공용 타입 파일로 정의해 양쪽이 같은 규칙을 쓰게 했고, 한쪽만 고쳐서 생기는 불일치를 빌드 단계에서 막았습니다. .vue 파일까지 vue-tsc로 타입 검사했습니다.",
                    logoText: "TS",
                    logoColor: "#002AB5",
                    logoBackground: "#97ABEF",
                },
                {
                    name: "JavaScript",
                    desc:
                        "브라우저에서 실행되는 로직을 직접 작성했습니다. TaxKit은 업로드한 엑셀을 서버로 보내지 않고 브라우저 안에서 읽고 계산해 통장 거래와 세금계산서를 대조하고, 이 포트폴리오는 별도 라이브러리 없이 IntersectionObserver(화면에 보이는 구간 감지)와 ResizeObserver(크기 변화 감지) 같은 브라우저 내장 기능으로 스크롤 연동 메뉴와 줄 번호를 구현했습니다.",
                    logoText: "JS",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "HTML5",
                    desc:
                        "div만 쓰지 않고 nav, main, section, article 같은 의미 있는 태그로 문서 구조를 잡아, 스크린 리더(화면을 음성으로 읽어 주는 프로그램)와 검색 엔진이 구조를 이해하게 했습니다. 펼침 버튼에는 aria-expanded, 선택 버튼에는 aria-pressed를 달아 상태를 음성으로도 알리고, 마우스 없이 Tab 키만으로 모든 기능을 쓸 수 있게 했습니다.",
                    logoText: "HT",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
                {
                    name: "CSS3",
                    desc:
                        "화면 폭에 따라 배치가 바뀌는 반응형 레이아웃을 Grid, Flexbox, 미디어 쿼리로 만들었습니다. 색과 간격은 CSS 변수로 한곳에 모아 테마를 한 번에 바꿀 수 있게 했고, 이 포트폴리오의 타이핑·글자 등장 효과는 자바스크립트 없이 CSS 애니메이션만으로 구현했습니다. 움직임을 줄여 달라는 사용자 설정(prefers-reduced-motion)이 켜져 있으면 애니메이션을 끕니다.",
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
                    desc:
                        "Composition API(<script setup>)로 화면 로직을 composable이라는 함수 단위로 나눠 작성했습니다. 예를 들어 TaxKit은 엑셀 읽기, 거래 대사, 위험 거래 탐지, 독촉 문구 생성을 각각 별도 파일로 분리해 화면 컴포넌트는 보여 주는 일만 하고, 계산 로직은 따로 테스트할 수 있게 했습니다.",
                    logoText: "VU",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Nuxt.js",
                    desc:
                        "Vue 기반 프레임워크로, 폴더 구조가 곧 페이지 주소가 됩니다. 서버 렌더링(서버가 완성된 HTML을 미리 만들어 보내는 방식)을 쓴 MoaCook과 이 포트폴리오는 첫 화면이 빠르고 검색 엔진도 내용을 읽을 수 있으며, 앱으로 포장하거나 정적 배포하는 ClaudeBoard, TaxKit, Camping&Joy는 브라우저에서만 도는 SPA로 구성했습니다. MoaCook에서는 Nuxt 서버 API로 레시피 등록, 검색, 이미지 업로드를 직접 만들었습니다.",
                    logoText: "NX",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Pinia",
                    desc:
                        "여러 화면이 함께 쓰는 데이터를 한곳(스토어)에서 관리하는 Vue의 상태 관리 도구입니다. Camping&Joy에서 캠핑 일정(camp)과 장비 목록(gear) 스토어를 나눠 모든 화면이 같은 데이터를 보게 했고, persistedstate 플러그인으로 새로고침하거나 앱을 껐다 켜도 입력한 내용이 남도록 했습니다.",
                    logoText: "PI",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "Tailwind CSS",
                    desc:
                        "HTML 클래스에 flex, p-4, text-sm 같은 짧은 유틸리티 클래스를 조합해 스타일을 지정하는 방식입니다. CSS 파일을 오가지 않고 마크업 안에서 간격, 색, 반응형(md: 등)을 바로 정할 수 있어, 반복되는 화면을 빠르게 구현했습니다.",
                    logoText: "TW",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "SCSS",
                    desc:
                        "CSS에 중첩, 변수, 믹스인(재사용하는 스타일 묶음)을 더한 문법입니다. 컴포넌트마다 scoped로 스타일 범위를 가둬 다른 화면에 영향이 번지지 않게 했고, TaxKit, ClaudeBoard, Camping&Joy에서 공통 스타일을 믹스인으로 묶어 재사용했습니다.",
                    logoText: "SC",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
                {
                    name: "Supabase",
                    desc:
                        "서버를 직접 만들지 않고 Supabase(PostgreSQL 데이터베이스와 파일 저장소)를 백엔드로 썼습니다. Camping&Joy는 DB 구조 변경 이력을 남기는 마이그레이션 SQL 3개와 행 단위 접근 규칙(RLS)을 작성해 공유 캠핑 일정을 저장했고, MoaCook은 서버 API에서 서비스 키로 접속해 레시피 데이터와 이미지(저장소 버킷)를 관리했습니다.",
                    logoText: "SB",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Capacitor",
                    desc:
                        "웹으로 만든 서비스를 거의 그대로 Android·iOS 앱으로 포장하는 도구입니다. Camping&Joy는 인터넷이 약한 캠핑장에서도 열리도록 정적 파일을 앱 안에 넣고, 파일 저장·공유 플러그인으로 결과 이미지를 기기에 저장하고 공유하게 했습니다. MoaCook은 Android APK와 iOS PWA(홈 화면에 추가해 쓰는 웹앱)로 제공합니다.",
                    logoText: "CP",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "ECharts",
                    desc:
                        "데이터를 막대, 선, 원형 같은 차트로 그려 주는 시각화 라이브러리입니다. 숫자만 나열하면 비교하기 어려운 데이터를 차트와 대시보드로 보여 줘서, 변화와 이상 구간을 한눈에 파악하게 했습니다.",
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
                    desc:
                        "Git으로 변경 이력을 남기고 GitHub으로 협업했습니다. 이 포트폴리오처럼 dev 브랜치에서 작업한 뒤 Pull Request(코드 검토를 요청하는 병합 요청)로 master에 합치는 Git Flow 방식으로 운영해, 작업 중인 코드가 운영 코드를 건드리지 않게 했습니다. 커밋 메시지에는 무엇을 왜 바꿨는지 한국어로 적었습니다.",
                    logoText: "GH",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
                },
                {
                    name: "Figma",
                    desc:
                        "디자이너가 전달한 Figma 시안에서 간격, 색, 글자 크기, 컴포넌트 구조를 직접 확인해 시안과 같은 화면을 구현했습니다.",
                    logoText: "FG",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "Claude Code (LLM)",
                    desc:
                        "Claude Code(터미널에서 쓰는 AI 코딩 도구)를 개발 전반에 활용했습니다. 프로젝트마다 CLAUDE.md에 코딩·언어 규칙을 적어 AI가 일관되게 작업하게 했고, oh-my-claudecode, ponytail, frontend-design 같은 스킬과 플러그인을 상황에 맞게 골라 썼습니다. 또 AI가 브라우저의 깨진 레이아웃을 직접 측정하도록 MCP(AI에 외부 도구를 연결하는 표준 규격) 서버 Inspector-Agent를 만들었습니다.",
                    logoText: "AI",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "Vercel",
                    desc:
                        "GitHub에 코드를 올리면 자동으로 빌드하고 배포해 주는 호스팅 서비스입니다. TaxKit, Camping&Joy, MoaCook을 Vercel로 배포해 서비스 주소를 운영했고, MoaCook은 서버 함수 지역을 서울(icn1)로 지정해 DB와 사용자 모두에게 가깝게 했습니다. 프리뷰 배포와 운영 배포를 나눠 관리했습니다.",
                    logoText: "VC",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
                },
                {
                    name: "Vite",
                    desc:
                        "빠른 개발 서버이자 번들러(여러 파일을 하나로 묶는 도구)입니다. Inspector-Agent에서는 Vite 플러그인을 직접 만들어, 빌드할 때 .vue 파일을 분석(@vue/compiler-sfc, @babel/parser)하고 각 화면 요소에 data-ia-src라는 속성으로 \"몇 번째 파일 몇 번째 줄\" 위치를 심었습니다. 그래서 브라우저에서 깨진 요소를 찾으면 소스 위치로 바로 연결됩니다.",
                    logoText: "VI",
                    logoColor: "#0121C2",
                    logoBackground: "#9FABE3",
                },
            ],
        },
    ])

    // 메뉴로 이동한 섹션은 사용자가 직접 스크롤(휠·터치·키보드)하기 전까지 활성으로 유지한다.
    // 짧은 연락처는 상단 20% 선에 닿지 못해 바로 앞 섹션이 활성으로 보이기 때문이다
    let pendingKey: SectionKey | undefined

    const releasePending = (): void => {
        if (!pendingKey) return
        pendingKey = undefined
        updateActiveSection()
    }

    const scrollToSection = (key: SectionKey): void => {
        const target = sectionRefs[key].value
        if (!target) return

        pendingKey = key
        activeSection.value = key
        // 연락처는 맨 아래로 보내 레이아웃이 끝까지 보이게 한다
        if (lenis) {
            lenis.resize()
            lenis.scrollTo(key === "contact" ? "bottom" : target)
        } else if (key === "contact") {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        } else {
            target.scrollIntoView({ behavior: "smooth" })
        }
    }

    // 히어로 위에서 커서 위치를 CSS 변수로 넘겨 스포트라이트와 점 격자 하이라이트가 따라오게 한다
    const onBoardMove = (e: PointerEvent): void => {
        const el = e.currentTarget as HTMLElement
        const rect = el.getBoundingClientRect()
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
        el.style.setProperty("--my", `${e.clientY - rect.top}px`)
    }

    const prefersReducedMotion = (): boolean =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // 이름 글자가 코드 기호로 깜빡이다 제 글자로 해독되는 효과 (진입 시 1회 + hover 때마다)
    const scrambleName = (intro: boolean): void => {
        const els = nameRef.value?.querySelectorAll<HTMLElement>(".board-char")
        if (!els || scrambling || prefersReducedMotion()) return
        scrambling = true
        let done = 0
        els.forEach((el, n): void => {
            const final = el.textContent?.trim() ?? ""
            const delay = intro ? Number(el.style.getPropertyValue("--i")) * 70 + 150 : n * 30
            let frame = 0
            const tick = (): void => {
                if (frame++ >= 8 + n) {
                    el.textContent = final
                    if (++done === els.length) scrambling = false
                    return
                }
                el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                setTimeout(tick, 45)
            }
            setTimeout(tick, delay)
        })
    }

    // 화면 상단 20% 선을 지난 마지막 섹션이 활성. 연락처는 짧아서 선에 닿지 못하므로 페이지 끝이면 활성
    const updateActiveSection = (): void => {
        if (pendingKey) {
            activeSection.value = pendingKey
            return
        }
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
        if (atBottom && contactRef.value) {
            activeSection.value = "contact"
            return
        }
        let current: SectionKey | undefined
        for (const key of ["about", "skill", "works"] as const) {
            const el = sectionRefs[key].value
            if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.2) current = key
        }
        activeSection.value = current
    }

    // 스크롤 위치를 에디터의 "Ln N"으로 환산해 상태바에 보여 준다
    const onScroll = (): void => {
        cancelAnimationFrame(scrollRafId)
        scrollRafId = requestAnimationFrame((): void => {
            line.value = Math.floor(window.scrollY / LINE_HEIGHT) + 1
            updateActiveSection()
            const max = document.documentElement.scrollHeight - window.innerHeight
            progressRef.value?.style.setProperty(
                "transform",
                `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`
            )
        })
    }

    const ensureLenis = (): Promise<void> =>
        new Promise<void>((resolve, reject): void => {
            if (window.Lenis) return resolve()

            let script = document.querySelector<HTMLScriptElement>('script[src*="lenis.min.js"]')
            if (!script) {
                script = document.createElement("script")
                script.src = "https://unpkg.com/lenis@1.3.8/dist/lenis.min.js"
                script.async = true
                document.head.appendChild(script)
            }
            script.addEventListener("load", (): void => resolve(), { once: true })
            script.addEventListener("error", (): void => reject(new Error("Lenis load failed")), {
                once: true,
            })
        })

    useHead({
        htmlAttrs: { lang: "ko" },
        link: [
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
            },
        ],
    })
    useSeoMeta({
        title: "HAM HYUN JUN | Front-End Developer",
        description: "프론트엔드 개발자 HAM HYUN JUN의 포트폴리오. 경력, 기술 스택, 프로젝트를 소개합니다.",
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

    // 단어 5개(마지막은 첫 단어 복사본) 높이 1.5em씩 4칸 이동 후 처음으로 이어진다
    @keyframes ticker {
        0%,
        20% {
            transform: translateY(0);
        }

        25%,
        45% {
            transform: translateY(-1.5em);
        }

        50%,
        70% {
            transform: translateY(-3em);
        }

        75%,
        95% {
            transform: translateY(-4.5em);
        }

        100% {
            transform: translateY(-6em);
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
        .ticker-list,
        .code-line,
        .code-prompt,
        .code-cursor,
        .board-lines span,
        .board-lines span::after {
            animation: none !important;
        }
    }

    .main-page {
        // PDF(인쇄)에서만 보이는 머리글
        .print-head {
            display: none;
        }

        // 상단 스크롤 진행 막대
        .progress {
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            z-index: 30;
            height: 2px;
            background: var(--green);
            box-shadow: 0 0 8px var(--green);
            transform: scaleX(0);
            transform-origin: left;
        }

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

                // 커서를 따라다니는 스포트라이트와, 커서 근처에서 밝아지는 점 격자
                .board-glow {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: radial-gradient(
                        420px circle at var(--mx, 75%) var(--my, 25%),
                        rgb(63 185 80 / 14%),
                        transparent 70%
                    );

                    &::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(rgb(63 185 80 / 80%) 1px, transparent 1px) 0 0 /
                            32px 32px;
                        mask-image: radial-gradient(
                            220px circle at var(--mx, 75%) var(--my, 25%),
                            #000,
                            transparent
                        );
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

                    p {
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

                    // < Front-End /> 라벨의 단어가 세로로 굴러 바뀐다
                    .board-ticker {
                        display: flex;
                        align-items: center;
                        gap: 0.6ch;
                        margin-bottom: 16px;
                        font-size: clamp(14px, 1.6vw, 22px);
                        color: var(--green);

                        &,
                        * {
                            font-family: var(--mono);
                        }

                        .ticker-window {
                            display: inline-block;
                            height: 1.5em;
                            overflow: hidden;
                            line-height: 1.5em;
                            font-weight: 700;
                        }

                        .ticker-list {
                            display: flex;
                            flex-direction: column;
                            animation: ticker 8s cubic-bezier(0.77, 0, 0.18, 1) infinite;

                            span {
                                height: 1.5em;
                                line-height: 1.5em;
                            }
                        }
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
                        color: var(--white);
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
                min-height: 100vh;
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

                    p {
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

        // 탐색기가 보이는 좁은 폭(태블릿)에서는 여백·탐색기·줄 번호를 줄여 가로 스크롤을 막는다
        @media (max-width: 1100px) {
            .section:not(.main-board) {
                padding: 80px 32px;
            }

            .main-contents {
                .main-aside {
                    width: 200px;
                }

                .main-editor .gutter {
                    display: none;
                }
            }
        }

        @media (max-width: 768px) {
            padding-bottom: 0;

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
                    padding-bottom: 72px;
                    background: var(--base-background);
                }
            }
        }
    }
</style>
