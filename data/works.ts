import type { MainWorkData } from "~/structure/user"

// 프로젝트를 추가하면 Works 섹션에 카드로 표시된다. 비어 있는 그룹은 섹션이 나타나지 않는다.
// aiTools는 실제로 개발에 쓴 Claude Code 스킬·플러그인·MCP이며, 세션 기록과 설정 파일로 확인된 것만 적는다.
// webImage·appImage는 public/ 기준 경로(예: "/works/a.png")이며, appImage는 앱 화면이 있을 때만 넣는다.

// 회사 업무로 진행한 프로젝트. 공개해도 되는 범위만 적는다.
export const companyWorks: MainWorkData[] = [
    {
        name: "에스크(Asked)",
        period: "2026. 06. ~ 2026. 09.",
        summary:
            "질문하고 답하는 소통 플랫폼 에스크의 웹, 앱(WebView) 프론트엔드입니다. 피드, 알림, 채팅, 검색, 쇼츠 화면이 있고 긴 목록은 가상 스크롤로 그립니다. 스크롤 위치와 목록을 캐시해 둬서 뒤로 가기 하면 보던 자리가 바로 복원되고, 채팅은 WebSocket, 갤러리·공유·광고·영상 압축 같은 앱 기능은 브릿지로 네이티브와 주고받습니다. 한/영 다국어 처리, 알림 전체 읽음 때 새 알림 배지 초기화, 채팅 검색 화면 폭과 상단 안전 영역 수정, statusBarTap 브릿지 추가, 게시글·댓글 텍스트 복사 기능을 했습니다. 화면 이미지는 실제 앱 화면에 더미 데이터를 채워 캡처한 것입니다.",
        stack: ["Nuxt 4", "Vue 3", "TypeScript", "Pinia", "Tailwind CSS 4", "SCSS", "i18n", "WebSocket"],
        defaultView: "web",
        webImage: "/works/asked.webp",
        appImage: "/works/asked-app.webp",
        appWide: true,
        links: [
            {
                label: "Google Play",
                href: "https://play.google.com/store/apps/details?id=com.mobions.asked2&hl=ko",
            },
            { label: "웹", href: "https://asked.kr/" },
        ],
    },
    {
        name: "사운드 아카이브",
        period: "2026. 02. ~ 2026. 07.",
        summary:
            "크리에이터가 영상에 쓸 음원을 찾고 내려받는 음원 아카이브 서비스 웹 프론트엔드입니다. 신곡이랑 숏폼·롱폼 전용 음원을 장르, 분위기, 속도 필터로 찾고, 미리듣기·즐겨찾기·다운로드, 구독 플랜 결제, 채널 등록 화면이 있습니다. 로그인·구독·채널 승인 여부는 라우트 미들웨어로 막고, 홈 데이터나 필터 옵션처럼 자주 부르는 응답은 캐시하며 SSR은 끄고 SPA로 돌립니다. 플랜 요금제 결제 페이지, 모바일 헤더 간격, 정기구독 영역 컴포넌트화, 빠진 i18n 키 채우기(키 이름 규칙 통일)와 로깅 추가, 채팅 토큰 API 연동, 구독 해지 문구 수정을 맡았습니다. 화면 이미지는 실제 앱 화면에 더미 데이터를 채워 캡처한 것입니다.",
        stack: ["Nuxt 4", "Vue 3", "TypeScript", "Pinia", "SCSS", "Embla Carousel", "i18n"],
        defaultView: "web",
        webImage: "/works/music-archive.webp",
        appImage: "/works/music-archive-app.webp",
        appWide: true,
        links: [],
    },
    {
        name: "고고고",
        period: "2025. 07. ~ 2026. 08.",
        summary:
            "쇼핑하고 별을 모아 룰렛으로 쿠폰 받는 리워드 앱(iOS, Android)의 프론트엔드입니다. Flutter WebView 안에서 돌아서 브릿지로 플랫폼, 안전 영역, 스낵바 같은 걸 받아 씁니다. 인증 토큰은 만료 전에 자동 갱신하고 실패하면 3번 재시도, 탭이 여러 개면 갱신된 토큰을 맞춰 줍니다. 목록에는 v-memo랑 lazy 로딩을 걸어 초기 로드를 줄였습니다. 오늘의 핫딜 목록(정렬, 태그 필터, 할인율 계산 유틸), 최저가 상세와 가격 변동 차트, 최저가 상품 등록 가이드 팝업, 오늘샀어요 글쓰기·댓글·신고, 비로그인(guest) 처리, 친구초대·구매내역 이벤트 화면을 만들고 Meta·adbrix·gtag 로깅을 붙였습니다. 쿠폰 만료 표시도 고쳤습니다.",
        stack: ["Nuxt 4", "Vue 3", "TypeScript", "Pinia", "SCSS", "Flutter WebView"],
        webImage: "/works/gogogo.webp",
        links: [
            {
                label: "Google Play",
                href: "https://play.google.com/store/apps/details?id=mediatech.gogogo.app&hl=ko",
            },
        ],
    },
    {
        name: "커넥트 스튜디오",
        period: "2024. 12. ~ 2025. 06.",
        summary:
            "광고주가 인플루언서 캠페인을 만들고 성과를 보는 대시보드 웹입니다. 홈에 진행 중 캠페인이랑 일정 캘린더가 있고, 캠페인 등록, 관리, 계약서 서명, 정산 화면이 있습니다. 성과는 핵심 지표와 성별·연령·국가별 시청자 분포를 ECharts로 그리고, 한/영 지원에 PC, 모바일 화면을 따로 구성했습니다. 계약서 관리(서명 이미지 크롭 포함), 정산관리(사업자 정보, 집행금액, 결제수단), 캠페인 성과 페이지, 공용 BottomSheet를 구현했습니다. 화면 이미지는 실제 앱 화면에 더미 데이터를 채워 캡처한 것입니다.",
        stack: ["Nuxt 3", "Vue 3", "TypeScript", "Pinia", "SCSS", "ECharts", "V-Calendar", "i18n"],
        defaultView: "web",
        webImage: "/works/connect-studio.webp",
        appImage: "/works/connect-studio-app.webp",
        appWide: true,
        links: [],
    },
    {
        name: "짤스튜디오",
        period: "2024. 05. ~ 2025. 08.",
        summary:
            "쇼츠·영상 크리에이터용 음원 협업·유통 플랫폼 웹 프론트엔드입니다. 파트너 대시보드(기간별 지표, 추이 차트, 채널·영상별 실적)랑 정산, 빠른정산 이벤트, 카카오톡 숏폼 크리에이터 모집 페이지가 있고, MCN·퓨처링크처럼 같은 코드에서 테마와 도메인만 달라지는 파트너용 사이트도 같이 운영합니다. 용량 큰 라이브러리는 manualChunks로 나누고 번역 메시지는 필요한 언어만 lazy 로드해서 번들을 줄였고, 한/영/일/중 다국어를 지원합니다. 정산관리(수익 보고서, 빠른정산), 유튜브·다음 연동 차트, 카카오 숏폼 가이드·신청·업로드 현황, 랜딩·이벤트 페이지, 파일 업로드 컴포넌트 쪽을 많이 했습니다.",
        stack: ["Nuxt 3", "Vue 3", "TypeScript", "SCSS", "ECharts", "Element Plus", "i18n"],
        webImage: "/works/zzal-studio.webp",
        links: [
            {
                label: "Google Play",
                href: "https://play.google.com/store/apps/details?id=ai.company.zzalstudio&hl=ko",
            },
            { label: "파트너 웹", href: "https://zzal.studio/login/partners" },
        ],
    },
    {
        name: "ESMS 관리자 웹",
        period: "2022. 03. ~ 2023. 08.",
        summary:
            "독거 어르신 댁에 설치한 IoT 장비의 상태랑 응급 이벤트를 한 화면에서 보는 관리자 웹입니다. 대시보드에서 장비, 이벤트 현황을 실시간으로 보고, 대상자 상세, 장비·센서 설정, 펌웨어, 공지 관리 화면을 만들었습니다. 대시보드와 이벤트 알림은 WebSocket으로 바로 갱신되고, 목록은 조건 필터랑 페이지네이션을 붙였습니다.",
        stack: ["Vue 2", "Vuex", "Vue Router", "Socket.IO", "Chart.js", "FullCalendar", "Axios", "CoreUI"],
        webImage: "/works/esms.webp",
        links: [],
    },
]

// 개인 사이드 프로젝트
export const sideWorks: MainWorkData[] = [
    {
        name: "ClaudeBoard",
        period: "2026. 10.",
        summary:
            "로컬에서 돌리는 여러 Claude Code 세션을 브라우저 한 화면에서 보고 지시·승인하는 대시보드입니다. 백엔드(Fastify)가 node-pty로 프로젝트마다 claude를 띄우고, 출력은 브라우저(WebSocket), 재접속용 버퍼, 서버 안의 보이지 않는 터미널(@xterm/headless) 세 곳으로 보냅니다. Claude Code는 같은 줄을 계속 다시 그려서 원시 출력을 정규식으로 읽으면 깨져서, 가상 터미널의 현재 화면을 기준으로 승인 대기, 작업 중, 대기 상태를 판정했습니다. 토큰은 ~/.claude/projects의 jsonl을 새로 추가된 줄만 읽어 집계하고, 서버와 화면이 주고받는 메시지 타입은 공용 패키지 하나로 맞췄습니다.",
        stack: ["Nuxt 4", "Vue", "TypeScript", "Fastify", "WebSocket", "node-pty", "xterm.js"],
        aiTools: ["oh-my-claudecode", "Inspector-Agent", "frontend-design", "ponytail"],
        webImage: "/works/claudeboard.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/ClaudeBoard" }],
    },
    {
        name: "TaxKit",
        period: "2026. 10.",
        summary:
            "세무사 사무실에서 엑셀 몇 개로 마감 업무를 끝내게 도와주는 웹 도구입니다. 통장 거래와 세금계산서 대사, 법인카드 소명 대상 탐지, 거래처별 독촉 문구 생성이 있고, 엑셀은 브라우저 안에서만 처리합니다(CSP로 외부 연결도 막음). 대사는 금액 0.5, 날짜 0.3, 상호 유사도 0.2로 점수를 매기고 유사도는 직접 구현했습니다. 후보는 통장 건당 상위 16개만 비교해서 같은 금액 3,000건도 3초 안에 끝나게 테스트로 묶었습니다. 소명 대상은 심야, 주말, 공휴일, 분할 결제 같은 규칙 점수를 합산하고, 엑셀은 헤더 행을 자동으로 찾아 열을 매핑합니다. 계산 로직은 순수 함수로 빼서 node --test로 돌립니다.",
        stack: ["Nuxt", "Vue", "TypeScript", "SCSS", "xlsx"],
        aiTools: ["oh-my-claudecode", "Inspector-Agent", "frontend-design", "ponytail"],
        webImage: "/works/taxkit.webp",
        links: [
            { label: "서비스", href: "https://taxkit-wine.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/TaxKit" },
        ],
    },
    {
        name: "Camping&Joy",
        period: "2026. 10.",
        summary:
            "캠핑 인원이 누가 어떤 장비를 챙길지 한곳에서 정하는 서비스로, 같은 코드로 웹, 안드로이드, iOS 앱을 냅니다. 화면은 Pinia 스토어(camp, gear)만 보고 스토어는 기기에 먼저 저장해서 인터넷이 끊겨도 열립니다. 서버(Supabase)와는 동기화 플러그인 두 개가 맞추는데, 마지막으로 서버와 맞춘 상태와 비교해 바뀐 행만 upsert/delete 해서 여럿이 동시에 고쳐도 남의 내용을 덮어쓰지 않고, 다른 사람 변경은 Realtime 알림으로 받습니다. 카카오 로그인으로 모임에 들어오면 관리자가 가입을 승인하고, 앱 빌드는 GitHub Actions로 합니다.",
        stack: ["Nuxt", "Vue", "Pinia", "Supabase", "Capacitor"],
        aiTools: ["oh-my-claudecode", "ponytail", "graphify"],
        webImage: "/works/camping-joy.webp",
        appImage: "/works/camping-joy-app.webp",
        links: [
            { label: "서비스", href: "https://camping-joy.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/Camping-Joy" },
        ],
    },
    {
        name: "Inspector-Agent",
        period: "2026. 10.",
        summary:
            "브라우저에서 깨진 레이아웃(가로 오버플로우, z-index 충돌 등)을 찾아 소스의 파일:라인에 연결하고, 고친 뒤 같은 화면을 다시 재서 확인하는 도구입니다. 헤드리스 Chromium이 여러 화면 너비에서 getBoundingClientRect, scrollWidth, ComputedStyle 같은 실제 렌더링 수치만으로 검사하고, 툴팁·모달은 직접 눌러서 연 상태까지 봅니다. Vite 플러그인이 요소마다 data-ia-src로 소스 위치를 심어 두고, 패치를 적용한 뒤 대상 결함이 사라지고 새 결함이 없을 때만 통과시키며 아니면 롤백합니다. TaxKit에 돌렸을 때 결함 43건이 패치 3건으로 0건이 됐습니다.",
        stack: ["TypeScript", "MCP", "Vite 플러그인", "헤드리스 Chromium"],
        aiTools: ["oh-my-claudecode", "ponytail"],
        webImage: "/works/inspector-agent.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/Inspector-Agent" }],
    },
    {
        name: "MoaCook",
        period: "2023. 08. ~ 2026. 10.",
        summary:
            "레시피를 한곳에 모아 검색·필터로 찾고, 상세에서 단계별 조리법과 유튜브 영상을 보는 서비스입니다. Nuxt SSR 화면에 Nitro API가 붙어 있고, Supabase 키와 YouTube API 키, 관리자 비밀번호는 서버 환경변수에만 둡니다. 검색어와 필터는 주소 쿼리에 넣어서 새로고침하거나 링크를 공유해도 같은 결과가 나오고, 목록 응답은 카드에 필요한 요약만 내려 가볍게 했습니다. 같은 조건의 목록은 캐시로 바로 보여 주고 뒤에서 갱신합니다. 관리자 화면에서 레시피와 사진을 등록·수정하고, 앱(Android APK, iOS PWA)은 Capacitor로 웹을 그대로 띄우는 구조라 배포하면 앱도 같이 최신이 됩니다.",
        stack: ["Nuxt 4", "TypeScript", "SCSS", "Supabase", "YouTube Data API", "Capacitor", "Vercel"],
        aiTools: ["Claude Code"],
        webImage: "/works/moacook.webp",
        appImage: "/works/moacook-app.webp",
        links: [
            { label: "서비스", href: "https://moa-cook.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/MoaCook" },
        ],
    },
    {
        name: "PixelBoss",
        period: "2026. 10.",
        summary:
            "여러 로컬·GitHub 프로젝트를 복셀 3D 가상 오피스에서 관리하는 대시보드입니다. 회의실에 팀장들을 모아 지시하면 각 부서가 코드는 안 고치고 한글 제안만 보고하고, 제안마다 진행/보류를 고르면 개발팀이 프로젝트별 git worktree 전용 브랜치에서 구현합니다. 그다음 QA 검수와 수정(최대 2회), 최종 반영 결정, 문서팀 기록 순이고 원본 폴더는 안 건드리며 push도 하지 않습니다. node-pty로 프로젝트끼리는 병렬, 같은 프로젝트는 부서 순서대로 돌립니다. 명령 분해는 LLM 없이 키워드 규칙과 git diff, 타입·린트 검사 결과로 해서 신호 없는 프로젝트는 아예 실행하지 않아 토큰을 아꼈습니다. 3D 오피스는 Three.js입니다.",
        stack: ["Nuxt 4", "Vue", "TypeScript", "Three.js", "node-pty", "WebSocket", "xterm.js"],
        aiTools: ["Claude Code"],
        webImage: "/works/pixelboss.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/PixelBoss" }],
    },
    {
        name: "LogicUI",
        period: "2026. 10.",
        summary:
            "스타일 없이 동작, WAI-ARIA 접근성, 키보드 인터랙션만 제공하는 헤드리스 React UI 라이브러리 모노레포입니다. Dialog, Tabs, Menu, Select, Combobox 등 16개 컴포넌트를 합성 컴포넌트(Root와 하위 파트)로 만들었고, 제어·비제어 상태, asChild, 스타일링용 data-* 속성, preventDefault로 막을 수 있는 콜백을 공통으로 지원합니다. 컴포넌트마다 APG 패턴을 따라 Vitest, Testing Library, vitest-axe로 검증하고 Playwright로 실제 Chromium 검사도 돌립니다. 팝오버 위치 계산은 직접 구현해서 화살표나 서브메뉴, 한글 typeahead는 아직 안 됩니다. Tailwind 스타일 패키지와 플레이그라운드 문서 사이트가 같이 있고 Turborepo로 묶었습니다.",
        stack: ["React", "TypeScript", "Tailwind CSS 4", "Vite", "Turborepo", "Vitest", "Playwright"],
        aiTools: ["Claude Code"],
        webImage: "/works/logicui.webp",
        links: [
            { label: "서비스", href: "https://logicui.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/LogicUI" },
        ],
    },
    {
        name: "VoicePilot",
        period: "2026. 10.",
        summary:
            "마우스와 키보드 없이 음성만으로 맥을 조작하는 로컬 도우미입니다. 파일럿이라고 부른 뒤 창, 모니터, 브라우저 탭 전환과 앱 실행, 클릭·스크롤, 웹 검색을 말로 시킵니다. 마이크 입력에서 발화 구간을 나누고(VAD) faster-whisper로 내 컴퓨터에서만 인식해서 녹음이 밖으로 안 나가고, 호출어 탐지 후 대기/듣기 상태 기계로 넘어갑니다. 명령 문장은 YAML에 적고 유사 문장 매칭을 해서 코드 수정 없이 추가할 수 있습니다. OS 조작은 인터페이스(DesktopController) 뒤로 빼서 macOS는 pyobjc로 구현했고, 테스트용 더미 구현으로 마이크나 모델 없이 pytest가 돌아갑니다.",
        stack: ["Python", "faster-whisper", "pyobjc", "YAML", "pytest"],
        aiTools: ["Claude Code"],
        webImage: "/works/voicepilot.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/VoicePilot" }],
    },
    {
        name: "vibe-context",
        period: "2026. 10.",
        summary:
            "Claude Code, Cursor 같은 AI 코딩 도구가 프로젝트 전체를 안 읽고도 과거 결정과 지금 변경 사항을 알게 해 주는 로컬 MCP 서버입니다. stdio로 붙고 도구는 프로젝트 등록·조회, get_git_delta, 세션 요약 저장, 과거 기억 검색으로 나눴습니다. git 변경은 simple-git으로 분석해 raw diff 대신 구조화된 요약으로 줘서 토큰을 줄이고, 결정·작업 내용은 SQLite(better-sqlite3, Drizzle, WAL 모드)에 저장하며 마이그레이션은 서버가 뜰 때 자동 적용합니다. 입출력은 zod 스키마로 검증하고, 검색은 지금은 키워드 방식인데 인터페이스 뒤에 둬서 나중에 바꿀 수 있게 했습니다. 데이터는 내 컴퓨터에만 있습니다.",
        stack: ["TypeScript", "MCP", "SQLite", "Drizzle ORM", "simple-git", "zod"],
        aiTools: ["Claude Code"],
        webImage: "/works/vibe-context.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/vibe-context" }],
    },
]
