import type { MainWorkData } from "~/structure/user"

// 프로젝트를 추가하면 Works 섹션에 카드로 표시된다. image는 public/ 기준 경로(예: "/works/a.png").
export const works: MainWorkData[] = [
    {
        name: "TaxKit",
        period: "2026. 10.",
        summary:
            "세무사 사무실 실무자가 엑셀 몇 개로 마감 업무를 끝내도록 돕는 웹 도구입니다. 통장 거래와 세금계산서 대사, 법인카드 소명 대상 탐지, 거래처별 독촉 문구 생성을 제공하며, 업로드한 엑셀은 브라우저 안에서만 처리하고 서버로 보내지 않습니다.",
        stack: ["Nuxt", "Vue", "TypeScript", "SCSS", "xlsx"],
        image: "/works/taxkit.jpg",
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
        image: "/works/camping-joy.jpg",
        links: [
            { label: "서비스", href: "https://camping-joy.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/Camping-Joy" },
        ],
    },
    {
        name: "MoaCook",
        period: "2023. 08. ~ 2026. 10.",
        summary:
            "레시피를 한곳에 모아 검색과 필터로 찾고, 상세 화면에서 단계별 조리법과 유튜브 영상을 보는 서비스입니다. 관리자 화면에서 레시피를 등록·수정하며 웹과 앱(Android APK, iOS PWA)으로 제공합니다.",
        stack: ["Nuxt 4", "TypeScript", "SCSS", "Supabase", "YouTube Data API", "Capacitor", "Vercel"],
        image: "/works/moacook.jpg",
        links: [
            { label: "서비스", href: "https://moa-cook.vercel.app" },
            { label: "GitHub", href: "https://github.com/HamHyunJun/MoaCook" },
        ],
    },
    {
        name: "Inspector-Agent",
        period: "2026. 10.",
        summary:
            "브라우저에서 깨진 레이아웃(가로 오버플로우, z-index 충돌 등)을 규칙으로 탐지해 소스의 파일:라인에 연결하고, 고친 뒤 같은 화면에서 재측정해 검증하는 도구입니다. 새 결함이 생기면 자동으로 롤백합니다.",
        stack: ["TypeScript", "MCP", "Vite 플러그인", "헤드리스 Chromium"],
        image: "/works/inspector-agent.jpg",
        links: [{ label: "GitHub", href: "https://github.com/HamHyunJun/Inspector-Agent" }],
    },
]
