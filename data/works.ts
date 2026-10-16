import type { MainWorkData } from "~/structure/user"

// 프로젝트를 추가하면 Works 섹션에 카드로 표시된다. 비어 있는 그룹은 섹션이 나타나지 않는다.
// aiTools는 실제로 개발에 쓴 Claude Code 스킬·플러그인·MCP이며, 세션 기록과 설정 파일로 확인된 것만 적는다.
// webImage·appImage는 public/ 기준 경로(예: "/works/a.png")이며, appImage는 앱 화면이 있을 때만 넣는다.

// 회사 업무로 진행한 프로젝트. 공개해도 되는 범위만 적는다.
export const companyWorks: MainWorkData[] = [
    {
        name: "고고고",
        period: "2025. 07. ~ 2026. 08.",
        summary:
            "쇼핑하고 별을 모아 룰렛으로 쿠폰을 받는 리워드 앱(iOS·Android)의 프론트엔드입니다. 별 적립 현황을 보여주는 홈 화면과 룰렛 돌리기, 출석체크·쿠폰함·친구초대 화면을 구현했습니다. 웹뷰 앱이라 앱 브릿지로 플랫폼과 안전 영역을 받아 화면에 반영하고, 인증 토큰은 쿠키와 메모리에 나눠 저장하며 만료 전에 자동으로 갱신하도록 했습니다.",
        stack: ["Nuxt 4", "Vue 3", "TypeScript", "Pinia", "SCSS", "Flutter WebView"],
        webImage: "/works/gogogo.webp",
        links: [],
    },
    {
        name: "짤스튜디오",
        period: "2024. 05. ~ 2025. 08.",
        summary:
            "쇼츠·영상 크리에이터를 위한 음원 협업·유통 플랫폼의 웹 프론트엔드입니다. 파트너가 채널의 조회수와 예상 수익을 확인하는 대시보드(기간별 지표·추이 차트, 채널별·영상별 실적)와, 카카오톡 숏폼 크리에이터 모집 등 프로모션·이벤트 페이지를 구현했습니다. 한국어·영어·일본어·중국어 다국어를 지원하고, 반복되는 화면은 컴포넌트와 composable로 나눠 재사용했습니다.",
        stack: ["Nuxt 3", "Vue 3", "TypeScript", "SCSS", "ECharts", "Element Plus", "i18n"],
        webImage: "/works/zzal-studio.webp",
        links: [],
    },
    {
        name: "ESMS 관리자 웹",
        period: "2022. 03. ~ 2023. 08.",
        summary:
            "독거 어르신 댁에 설치한 IoT 장비의 상태와 응급 이벤트를 한 화면에서 관제하는 관리자 웹입니다. 대시보드에서 장비·이벤트 현황을 실시간으로 확인하고, 대상자 상세, 장비·센서 설정, 펌웨어와 공지 관리 화면을 구현했습니다. 대시보드와 이벤트 알림은 WebSocket으로 실시간 갱신하고, 목록 화면에는 조건 필터와 페이지네이션을 적용했습니다.",
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
            "로컬에서 돌아가는 여러 Claude Code 세션을 브라우저 한 화면에서 모니터링하고 지시·승인하는 관제 대시보드입니다. 세션별 상태와 진행률, 토큰 사용량을 한 줄씩 보여주고, 승인 대기나 토큰 급증처럼 사람이 개입할 순간만 알립니다.",
        stack: ["Nuxt 4", "Vue", "TypeScript", "Fastify", "WebSocket", "node-pty", "xterm.js"],
        aiTools: ["oh-my-claudecode", "Inspector-Agent", "frontend-design", "ponytail"],
        webImage: "/works/claudeboard.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/ClaudeBoard" }],
    },
    {
        name: "TaxKit",
        period: "2026. 10.",
        summary:
            "세무사 사무실 실무자가 엑셀 몇 개로 마감 업무를 끝내도록 돕는 웹 도구입니다. 통장 거래와 세금계산서 대사, 법인카드 소명 대상 탐지, 거래처별 독촉 문구 생성을 제공하며, 업로드한 엑셀은 브라우저 안에서만 처리하고 서버로 보내지 않습니다.",
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
            "캠핑 인원이 누가 어떤 장비를 챙길지 한 곳에서 정하는 서비스입니다. 장비 등록, 공통 장비 배분, 일정표, 결과 이미지·텍스트 공유를 지원하고 웹과 안드로이드·iOS 앱으로 쓸 수 있습니다.",
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
            "브라우저에서 깨진 레이아웃(가로 오버플로우, z-index 충돌 등)을 규칙으로 탐지해 소스의 파일:라인에 연결하고, 고친 뒤 같은 화면에서 재측정해 검증하는 도구입니다. 새 결함이 생기면 자동으로 롤백합니다.",
        stack: ["TypeScript", "MCP", "Vite 플러그인", "헤드리스 Chromium"],
        aiTools: ["oh-my-claudecode", "ponytail"],
        webImage: "/works/inspector-agent.webp",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/Inspector-Agent" }],
    },
    {
        name: "MoaCook",
        period: "2023. 08. ~ 2026. 10.",
        summary:
            "레시피를 한곳에 모아 검색과 필터로 찾고, 상세 화면에서 단계별 조리법과 유튜브 영상을 보는 서비스입니다. 관리자 화면에서 레시피를 등록·수정하며 웹과 앱(Android APK, iOS PWA)으로 제공합니다.",
        stack: ["Nuxt 4", "TypeScript", "SCSS", "Supabase", "YouTube Data API", "Capacitor", "Vercel"],
        aiTools: ["Claude Code"],
        webImage: "/works/moacook.webp",
        appImage: "/works/moacook-app.webp",
        links: [
            { label: "서비스", href: "https://moa-cook.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/MoaCook" },
        ],
    },
]
