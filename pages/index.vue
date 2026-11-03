<template>
    <main class="main-page">
        <div ref="progressRef" class="progress" aria-hidden="true"></div>
        <header class="print-head" aria-hidden="true">
            <p class="print-name">HAM HYUN JUN</p>
            <p class="print-role">Front-End Developer</p>
            <p class="print-url">
                <a :href="siteUrl" tabindex="-1">{{ siteUrl }}</a>
            </p>
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

        // 로드에 실패하면 브라우저 기본 스크롤을 쓴다
        ensureLenis().then((): void => {
            lenis = new window.Lenis({ duration: 1.0, smoothWheel: true })

            const lenisRaf = (time: number): void => {
                lenis.raf(time)
                lenisRafId = requestAnimationFrame(lenisRaf)
            }
            lenisRafId = requestAnimationFrame(lenisRaf)
        }).catch((): void => {})

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
                    "자사 주요 서비스 짤스튜디오, 고고고, 에스크, 사운드 아카이브 프론트엔드 개발",
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
                        "서버와 화면이 주고받는 메시지 타입을 공용 파일 하나에 몰아두고 양쪽이 같이 가져다 써서, 한쪽만 고치면 빌드에서 바로 에러가 나게 했습니다. .vue 파일까지 vue-tsc로 검사했고, any는 쓰지 않고 interface 위주로 모델을 정의했습니다.",
                    logoText: "TS",
                    logoColor: "#002AB5",
                    logoBackground: "#97ABEF",
                },
                {
                    name: "JavaScript",
                    desc:
                        "엑셀 파싱이나 점수 계산처럼 브라우저에서 끝낼 수 있는 건 서버 없이 클라이언트에서 처리했습니다. 스크롤 연동 메뉴나 크기 변화 감지는 라이브러리 없이 IntersectionObserver, ResizeObserver로 짰고, 검색 입력에는 debounce를 걸었습니다.",
                    logoText: "JS",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "HTML5",
                    desc:
                        "div 남발하지 않고 nav, main, section, article 위주로 구조를 잡았습니다. 펼침 버튼엔 aria-expanded, 선택 버튼엔 aria-pressed를 달았고, 마우스 없이 Tab만으로 다 누를 수 있는지는 직접 눌러보면서 확인했습니다.",
                    logoText: "HT",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
                {
                    name: "CSS3",
                    desc:
                        "반응형은 Grid, Flexbox, 미디어 쿼리로 잡고 색이랑 간격은 CSS 변수로 모아서 한 번에 바꿀 수 있게 했습니다. 타이핑이나 글자 등장 같은 효과는 JS 없이 CSS 애니메이션으로 하고, prefers-reduced-motion이 켜져 있으면 꺼지게 했습니다.",
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
                        "script setup으로 쓰고 로직은 composable로 빼서 작성했습니다. 데이터 읽기, 계산, 규칙 판정을 각각 파일로 나눠서 컴포넌트는 화면만 그리고, 계산 쪽은 따로 테스트할 수 있게 했습니다. 긴 목록은 가상 스크롤로 그렸습니다.",
                    logoText: "VU",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Nuxt.js",
                    desc:
                        "첫 화면이 중요한 서비스는 SSR, 앱으로 포장하거나 정적 배포하는 쪽은 SPA로 나눠 설정했습니다. 라우트 미들웨어로 로그인, 구독 여부에 따라 접근을 막았고, Nitro 서버 API로 등록, 검색, 이미지 업로드를 직접 만들었습니다. 자주 부르는 응답은 useState로 캐시했습니다.",
                    logoText: "NX",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Pinia",
                    desc:
                        "여러 화면이 같이 쓰는 데이터는 스토어로 나눠서 모든 화면이 같은 값을 보게 했습니다. persistedstate를 붙여서 새로고침하거나 앱을 껐다 켜도 입력한 게 남게 했고, 서버와 맞추는 건 스토어 변경을 지켜보다 바뀐 것만 올리는 방식으로 처리했습니다.",
                    logoText: "PI",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "Tailwind CSS",
                    desc:
                        "간격, 색, 반응형(md: 같은 것)을 마크업에서 바로 정해서 반복되는 화면을 빠르게 만들 때 썼습니다. 색은 테마 값을 CSS 변수로 받아 쓰게 해서 나중에 바꿔도 클래스는 안 건드립니다.",
                    logoText: "TW",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "SCSS",
                    desc:
                        "scoped로 컴포넌트 범위 안에서만 스타일이 먹게 하고 중첩이랑 변수를 기본으로 썼습니다. 반복되는 스타일은 믹스인으로 빼고, 디자인 토큰은 변수로 모아서 화면마다 값이 어긋나지 않게 했습니다.",
                    logoText: "SC",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
                {
                    name: "Supabase",
                    desc:
                        "마이그레이션 SQL로 DB 구조 변경 이력을 남기고 RLS(행 단위 접근 규칙)로 모임 단위 접근을 막았습니다. 변경은 Realtime 알림으로 받고, 서버 API에서는 서비스 키로 붙어 데이터와 이미지 버킷을 관리했습니다. 키는 서버 환경변수에만 두었습니다.",
                    logoText: "SB",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "Capacitor",
                    desc:
                        "웹으로 만든 걸 Android, iOS 앱으로 포장했습니다. 인터넷이 약한 곳에서도 열리도록 정적 파일을 앱 안에 넣고, 파일 저장·공유 플러그인으로 결과 이미지를 기기에 저장하게 했습니다. 빌드는 GitHub Actions로 돌렸습니다.",
                    logoText: "CP",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "ECharts",
                    desc:
                        "막대, 선, 원형 차트로 지표 추이와 분포를 그렸습니다. 날짜 범위 바꾸면 차트가 같이 갱신되게 했고, 툴팁 날짜나 계열 순서처럼 읽는 데 걸리는 부분을 따로 손봤습니다.",
                    logoText: "EC",
                    logoColor: "#7F0048",
                    logoBackground: "#F28DC6",
                },
                {
                    name: "i18n (Nuxt i18n)",
                    desc:
                        "vue-i18n 기반 @nuxtjs/i18n으로 한국어, 영어(일본어, 중국어 포함) 다국어를 처리했습니다. 번역 키는 PascalCase로 규칙을 통일하고 빠진 키는 확인해서 채웠으며, 메시지는 필요한 언어만 lazy 로드해 번들을 줄였습니다. 언어를 바꾸면 API 요청 헤더의 언어 값도 같이 바뀌게 했습니다.",
                    logoText: "IN",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "React",
                    desc:
                        "합성 컴포넌트(Root와 하위 파트), 제어·비제어 상태, forwardRef, asChild 패턴으로 헤드리스 컴포넌트를 만들었습니다. 스타일은 data-* 속성으로만 열어 두고 동작과 접근성만 담당하게 나눴습니다.",
                    logoText: "RE",
                    logoColor: "#073B8B",
                    logoBackground: "#94AFD9",
                },
                {
                    name: "Node.js / Fastify",
                    desc:
                        "Fastify로 REST와 WebSocket 서버를 만들고 node-pty로 터미널 프로세스를 띄워 출력을 브라우저로 중계했습니다. 서버와 화면이 주고받는 메시지 타입은 공용 패키지로 맞췄습니다.",
                    logoText: "ND",
                    logoColor: "#1D4900",
                    logoBackground: "#69C32D",
                },
                {
                    name: "WebSocket / Socket.IO",
                    desc:
                        "채팅과 실시간 관제 화면처럼 서버가 먼저 보내야 하는 데이터에 썼습니다. 연결은 앱 초기화가 끝난 뒤에 맺고, 출력이 몰릴 땐 일정 간격으로 묶어 보내 화면 갱신을 줄였습니다. 재접속하면 놓친 내용을 다시 받아 채웁니다.",
                    logoText: "WS",
                    logoColor: "#4A3F00",
                    logoBackground: "#C5AD1C",
                },
                {
                    name: "Three.js",
                    desc:
                        "복셀 3D 오피스를 그렸습니다. 프로젝트 수에 맞춰 책상과 건물이 자동으로 늘어나고, 마우스 드래그로 탑뷰와 사이드 뷰, 회전, 줌을 오가게 했습니다. 캐릭터 상태(작업 중, 이슈, 완료)는 애니메이션과 아이콘으로 나눠 보여 줍니다.",
                    logoText: "3D",
                    logoColor: "#7F0048",
                    logoBackground: "#F28DC6",
                },
                {
                    name: "Vitest / Playwright",
                    desc:
                        "순수 함수로 뺀 로직은 Vitest나 node --test로 검증하고, 컴포넌트는 Testing Library와 vitest-axe로 접근성까지 검사했습니다. 실제 동작은 Playwright로 Chromium에서 클릭, 키보드를 돌려 확인했고, 외부 요청 0건과 콘솔 에러 0건을 기준으로 삼았습니다.",
                    logoText: "TE",
                    logoColor: "#850000",
                    logoBackground: "#F39393",
                },
            ],
        },
        {
            category: "Tools",
            data: [
                {
                    name: "GitHub",
                    desc:
                        "회사 컨벤션대로 커밋 메시지에 feat, fix, refactor, chore, docs, ci 접두사를 붙이고 한 커밋에 한 가지 변경만 담았습니다. feature 브랜치에서 작업해 PR로 dev, staging을 거쳐 main에 반영하는 흐름을 따랐고, 버전은 커밋 접두사에 따라 자동으로 올라가게 해둔 규칙에 맞췄습니다.",
                    logoText: "GH",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
                },
                {
                    name: "Figma",
                    desc:
                        "시안에서 간격, 색, 글자 크기, 컴포넌트 구조를 직접 재서 똑같이 맞췄습니다. 반복되는 요소는 컴포넌트로 묶고 디자인 토큰 값은 변수로 옮겨 시안과 코드가 어긋나지 않게 했습니다.",
                    logoText: "FG",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "Claude Code (LLM)",
                    desc:
                        "개발할 때 거의 항상 켜놓고 썼습니다. CLAUDE.md에 코딩 규칙이랑 언어 규칙을 적어놔서 결과물이 들쭉날쭉하지 않게 했고, oh-my-claudecode, ponytail, frontend-design 같은 스킬은 작업 보고 골라 썼습니다. 깨진 레이아웃을 AI가 직접 재게 하려고 MCP 서버(Inspector-Agent)도 따로 만들었습니다.",
                    logoText: "AI",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "Vercel",
                    desc:
                        "GitHub에 올리면 자동으로 빌드·배포되게 연결하고 프리뷰 배포와 운영 배포를 나눠 썼습니다. 서버 함수 지역을 서울(icn1)로 지정해 DB와 사용자 모두에게 가깝게 했고, vercel.json에 CSP 같은 보안 헤더를 붙였습니다.",
                    logoText: "VC",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
                },
                {
                    name: "Vite",
                    desc:
                        "빌드 때 돌아가는 플러그인을 직접 만들었습니다. .vue 파일을 분석해서(@vue/compiler-sfc, @babel/parser) 요소마다 data-ia-src로 몇 번째 파일 몇 번째 줄인지 심어놔서, 깨진 요소를 찾으면 소스 위치로 바로 이어집니다.",
                    logoText: "VI",
                    logoColor: "#0121C2",
                    logoBackground: "#9FABE3",
                },
                {
                    name: "WebView 앱 브릿지",
                    desc:
                        "Flutter WebView 안에서 웹이 네이티브 기능을 쓰도록 브릿지를 연동했습니다. 안전 영역, 스낵바, 갤러리, 공유, 영상 압축, 상태바 탭 같은 호출을 만들고 이벤트 타입을 구체화했습니다. 앱 버전에 따라 지원하지 않는 호출은 분기했고, 웹에서도 같은 화면이 돌도록 대체 동작을 두었습니다.",
                    logoText: "WB",
                    logoColor: "#730673",
                    logoBackground: "#DB96DB",
                },
                {
                    name: "이벤트 로깅",
                    desc:
                        "GA(gtag), Meta Pixel, adbrix, Clarity로 페이지와 버튼 이벤트를 쌓았습니다. 로그인 전 사용자 이벤트와 누락된 이벤트를 따로 확인해 채웠고, 룰렛 같은 핵심 동선은 네이티브 이벤트로도 보냈습니다.",
                    logoText: "LG",
                    logoColor: "#663005",
                    logoBackground: "#D2A480",
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

    const siteUrl = "https://hyunjun-portfolio-three.vercel.app"

    useHead({
        htmlAttrs: { lang: "ko" },
        link: [
            { rel: "canonical", href: siteUrl },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
            },
        ],
    })
    const seoTitle = "HAM HYUN JUN | Front-End Developer"
    const seoDescription = "프론트엔드 개발자 HAM HYUN JUN의 포트폴리오. 경력, 기술 스택, 프로젝트를 소개합니다."
    useSeoMeta({
        title: seoTitle,
        description: seoDescription,
        ogTitle: seoTitle,
        ogDescription: seoDescription,
        ogType: "website",
        ogUrl: siteUrl,
        ogImage: `${siteUrl}/og.jpg`,
        ogLocale: "ko_KR",
        twitterCard: "summary_large_image",
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
                display: flex;
                flex-direction: column;
                min-height: 100vh;
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
                    flex: 1;
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
                    // 줄 번호가 행 높이를 붙잡아 상세를 닫아도 본문이 줄어들지 못하는 문제 방지
                    contain: size;
                    border-right: 1px solid var(--line);
                    background: var(--base-background);
                    font-family: var(--mono);
                    font-size: 12px;
                    color: var(--white);
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
