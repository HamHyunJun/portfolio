# HAM HYUN JUN — Portfolio

프론트엔드 개발자 함현준의 개인 포트폴리오 사이트입니다. 개발자 컨셉(VS Code 에디터 레이아웃 + 터미널 그린 포인트)의 다크 테마 단일 페이지(Home → About → Skills → Works → Contact)로, 경력과 기술 스택, 직접 만든 프로젝트를 소개합니다.

배포 주소: https://hyunjun-portfolio-three.vercel.app/

## 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 프레임워크 | Nuxt 3, Vue 3 (`<script setup>` + TypeScript) |
| 스타일 | SCSS (scoped, CSS 변수 기반 테마) |
| 폰트 | JetBrains Mono (Google Fonts), 한글은 시스템 폰트로 대체 |
| 라이브러리 | Embla Carousel(+Autoplay), AOS, Lenis(CDN 로드) |
| 패키지 매니저 | pnpm |

`@inspector-agent/vite-plugin`은 개발 서버(`pnpm dev`)에서만 동작하는 점검용 devDependency라 프로덕션 빌드에는 포함되지 않습니다. `nuxt.config.ts`의 `allowedHosts`는 임시 터널(cloudflared)로 외부 접속할 때만 필요합니다.

외부 라이브러리는 꼭 필요한 것만 쓰고, 나머지는 브라우저 표준 API로 구현했습니다.

## 디자인

- **팔레트**: GitHub 다크 계열 배경(`#0d1117`)에 터미널 그린(`#3fb950`) 포인트. 파랑·보라·주황은 코드 하이라이트와 Skills 카테고리 색에만 씁니다. 모든 색은 `assets/scss/main.scss`의 CSS 변수입니다.
- **폰트**: 라벨과 본문 모두 JetBrains Mono. 모노스페이스 폭을 이용해 타이핑 효과의 폭을 `ch` 단위로 계산합니다.
- **레이아웃**: 좌측 파일 탐색기(`about.md`, `skills.json`, `works.tsx`, `contact.sh`), 상단 탭, 줄 번호, 하단 상태바로 에디터처럼 구성했습니다.

## 주요 기능과 구현 방식

### 히어로
- 에디터 창 제목 줄, 글자 단위로 올라오는 이름(채움 글자), 가로선과 빛줄기, 점 격자 배경.
- `< Front-End />` 라벨의 단어가 `Front-End → Vue → Nuxt → TypeScript` 순으로 롤링됩니다(CSS 애니메이션).
- 코드 블록(`const developer = {…}`)이 한 줄씩 타이핑되고, 끝나면 `$ ▌` 커서가 깜빡입니다(CSS `steps()`, JS 없음).
- 커서를 따라다니는 스포트라이트와 커서 근처에서 밝아지는 점 격자(`pointermove` → CSS 변수 `--mx`, `--my`).
- 이름 글자가 코드 기호로 깜빡이다 제 글자로 해독되는 효과(진입 시와 이름 hover 시).

### 모션
- 화면 상단 스크롤 진행 막대, 섹션 내용은 AOS로 스크롤 시 등장합니다.
- Contact 카드는 커서를 따라오는 글로우(`utils/glow.ts`).
- `prefers-reduced-motion`이 켜져 있으면 모든 모션을 끕니다.

### 에디터 레이아웃 (Aside · Tabs · StatusBar)
- 탐색기(`MainAside`)와 상단 탭(`MainTabs`)은 현재 섹션을 같이 표시하고, 클릭하면 해당 섹션으로 이동합니다.
- 활성 섹션은 스크롤 위치로 계산합니다. 화면 상단 20% 선을 지난 마지막 섹션이 활성이고, 연락처는 짧아서 선에 닿지 못하므로 페이지 끝이면 활성입니다.
- 줄 번호는 `ResizeObserver`로 에디터 높이를 재서 개수를 정하고, 상태바의 `Ln N`은 스크롤 위치에서 계산합니다.
- 메뉴 이동은 Lenis의 `scrollTo`를 쓰고, Lenis를 쓸 수 없으면 `scrollIntoView`로 대체합니다.

### About
- 경력 → 자격 및 수상 → 학력 순으로 보여 주고, 각 블록은 위에서 아래로 갈수록 최신입니다. 경력에는 회사별 성과(`points`)가 붙습니다.
- 세 블록의 제목 칸 폭을 고정하고 내용 칸이 남은 폭을 모두 차지해 세로선 위치가 같습니다.
- 데이터는 `pages/index.vue`의 `aboutData`에서 수정합니다.

### Skills
- 카테고리마다 칩을 나열하고, 칩을 선택하면 아래 상세 패널에 설명이 나옵니다(`button` + `aria-pressed`, 패널은 `aria-live`).
- 카테고리별 색(Languages 파랑, Frameworks & Libraries 그린, Tools 주황)을 칩·패널·로고 배지에 씁니다.
- 설명은 실제 프로젝트 코드와 사용 이력에 근거해 작성합니다. 데이터는 `pages/index.vue`의 `skillData`입니다.

### Works
- `data/works.ts`의 `companyWorks`(회사 프로젝트)와 `sideWorks`(사이드 프로젝트)를 그룹별 캐러셀로 보여 줍니다. 비어 있는 그룹은 섹션이 나타나지 않습니다.
- 카드 어디를 눌러도 상세가 펼쳐지고, 옆 카드를 누르면 그쪽으로 넘어갑니다. 드래그와 자동 재생, hover 시 테두리·그림자 변화를 지원합니다.
- 카드에 웹 화면과 앱 화면이 모두 있으면 `WEB | APP` 토글로 전환합니다. 앱 화면은 폰 프레임 안에 세로로 표시합니다.
- 상세 영역은 아코디언입니다. `grid-template-rows: 0fr → 1fr` 트랜지션으로 높이를 애니메이션하고, 닫힌 상태에서는 `inert`로 포커스를 막습니다.
- 상세에 기술 스택과 함께 `AI TOOLS`(실제로 쓴 Claude Code 스킬·플러그인·MCP)를 보여 줍니다. 세션 기록과 설정 파일로 확인된 것만 적습니다.

### Contact와 PDF 저장
- `data/contacts.ts`에 링크를 추가하면 카드가 자동으로 늘어납니다. 링크 형식(`tel:`, `mailto:`, GitHub 주소)을 보고 종류 라벨을 붙입니다.
- `PDF로 저장` 버튼은 `window.print()`로 브라우저 인쇄 창을 엽니다. 인쇄할 때만 문서 제목을 `HAM HYUN JUN - Portfolio`로 바꿔 파일 이름을 정합니다.
- 인쇄 스타일은 `assets/scss/print.scss`에 있습니다.
  - 색 변수를 밝은 종이용으로 바꾸고, 히어로·탐색기·탭·줄 번호·상태바·진행 막대·버튼은 숨깁니다.
  - Skills는 클릭할 수 없으므로 모든 기술의 설명을 2열로 펼치고, Works 캐러셀은 세로 목록으로 펼쳐 상세를 모두 엽니다(이미지는 지연 로딩이라 제외, 링크는 주소와 함께 표시).
  - About / Skills / Works / Contact는 새 쪽에서 시작하고, 경력 항목·카테고리·카드는 쪽 경계에서 쪼개지지 않습니다. 현재 5쪽입니다.

### 접근성과 반응형
- 시맨틱 태그(`main`, `nav`, `section`, `article`)와 WAI-ARIA(`aria-expanded`, `aria-pressed`, `aria-controls`, `aria-live` 등)를 사용했습니다.
- 모든 인터랙티브 요소에 Tab 포커스 스타일과 호버·클릭 트랜지션을 줬습니다.
- 1100px 이하에서는 여백을 줄이고 탐색기를 좁히며 줄 번호를 숨기고, About의 제목을 내용 위로 쌓아 가로 스크롤을 막습니다.
- 768px 이하에서는 탐색기가 하단 탭 바(4칸, 구분선, 활성 칸 강조, 하단 안전 영역 반영)로 바뀌고 탭·줄 번호·상태바는 숨깁니다.
- 320px~1280px 구간에서 가로 스크롤이 없는지 헤드리스 Chrome으로 측정해 확인했습니다.
- `useSeoMeta`로 title·description을 지정했습니다.

## 프로젝트 구조

```
├── pages/index.vue            메인 페이지: 섹션 조립, 스크롤·옵저버·AOS 초기화, 히어로 모션, About·Skills 데이터
├── components/
│   ├── MainAside.vue          파일 탐색기 스타일 섹션 내비 (모바일은 하단 탭 바)
│   ├── MainTabs.vue           에디터 상단 탭 바
│   ├── MainStatusBar.vue      하단 상태바
│   ├── MainAbout.vue          경력·수상·학력
│   ├── MainSkill.vue          칩 + 상세 패널
│   ├── MainWorks.vue          회사/사이드 프로젝트 캐러셀
│   ├── MainContact.vue        연락처 + PDF 저장 버튼
│   ├── MainSectionTitle.vue   섹션 제목
│   └── ui/                    Embla 캐러셀 래퍼
├── data/                      works.ts, contacts.ts — 콘텐츠만 수정하는 곳
├── structure/user.ts          데이터 타입 정의
├── utils/glow.ts              카드 커서 글로우 헬퍼 (`export default` 객체)
├── assets/scss/               전역 스타일, 색상 변수, 아이콘(mask 기반), 인쇄 스타일
└── public/works/              프로젝트 화면 이미지
```

## 실행

```bash
pnpm install
pnpm dev        # http://localhost:3004
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과 미리보기
```

## 콘텐츠 수정

- **프로젝트 추가**: `data/works.ts`의 `companyWorks`(회사) 또는 `sideWorks`(사이드)에 항목을 추가하고 이미지를 `public/works/`에 넣습니다. `appImage`는 앱 화면이 있을 때만, `aiTools`는 실제로 쓴 도구가 있을 때만 넣습니다. 회사 프로젝트는 공개해도 되는 범위만 적습니다.
- **경력·학력·수상·스킬**: `pages/index.vue`의 `aboutData`, `skillData`를 고칩니다.
- **연락처**: `data/contacts.ts`.

```ts
{
    name: "프로젝트명",
    period: "2026. 10.",
    summary: "한두 문장 소개",
    stack: ["Nuxt", "TypeScript"],
    aiTools: ["oh-my-claudecode", "ponytail"],
    webImage: "/works/name.jpg",
    appImage: "/works/name-app.jpg",
    links: [{ label: "GitHub", href: "https://github.com/..." }],
}
```

## 브랜치

`dev`에서 작업하고 `master`로 병합합니다. `master`에 push하면 Vercel이 배포하도록 연결돼 있을 수 있으니, 병합 전에 `pnpm build`로 확인합니다.
