# HAM HYUN JUN — Portfolio

프론트엔드 개발자 함현준의 개인 포트폴리오 사이트입니다. 다크 테마의 단일 페이지(Home → About → Skills → Works → Contact)로, 경력과 기술 스택, 직접 만든 프로젝트를 소개합니다.

배포 주소: https://hyunjun-portfolio-three.vercel.app/

## 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 프레임워크 | Nuxt 3, Vue 3 (`<script setup>` + TypeScript) |
| 스타일 | SCSS (scoped, CSS 변수 기반 다크 테마) |
| 라이브러리 | Embla Carousel(+Autoplay), AOS, Lenis(CDN 로드) |
| 패키지 매니저 | pnpm |

외부 라이브러리는 꼭 필요한 것만 쓰고, 나머지는 브라우저 표준 API로 구현했습니다.

## 주요 기능과 구현 방식

### 히어로
- 이름이 글자 단위로 아래에서 올라오고, 가로선이 방향을 번갈아 들어온 뒤 빛줄기가 지나갑니다.
- 모두 CSS `@keyframes`와 `animation-delay`(`--i`, `--n` 변수)로만 구현했고 JS는 쓰지 않습니다.
- `prefers-reduced-motion`이 켜져 있으면 애니메이션을 끕니다.

### 모션
- 히어로: 커서를 따라다니는 스포트라이트와 점 격자 하이라이트, `< Front-End />` 라벨의 단어 롤링, 이름이 코드 기호로 깜빡이다 해독되는 효과(진입 시와 hover 시).
- 히어로 아래 기술 이름 마키(두 줄, 반대 방향), 화면 상단 스크롤 진행 막대.
- Skills·Contact 카드는 커서를 따라오는 글로우(`utils/glow.ts`), 섹션 내용은 AOS로 스크롤 시 등장합니다.
- `prefers-reduced-motion`이 켜져 있으면 모든 모션을 끕니다.

### 에디터 레이아웃 (Aside · Tabs · StatusBar)
- VS Code처럼 좌측 파일 탐색기(`about.md`, `skills.json`, `works.tsx`), 상단 탭, 줄 번호, 하단 상태바로 구성했습니다.
- 줄 번호는 `ResizeObserver`로 에디터 높이를 재서 개수를 정하고, 상태바의 `Ln N`은 스크롤 위치에서 계산합니다.
- 데스크톱은 좌측 sticky 탐색기, 768px 이하에서는 하단 고정 바로 바뀌고 탭·줄 번호·상태바는 숨깁니다.
- 현재 섹션 표시는 `IntersectionObserver`가 스크롤 위치를 추적해 갱신합니다.
- 메뉴 이동은 Lenis의 `scrollTo`를 쓰고, Lenis를 쓸 수 없으면 `scrollIntoView`로 대체합니다.
- 하단 바가 Tab 포커스 요소를 가리지 않도록 모바일에서 `scroll-padding-bottom`을 줬습니다.

### Works
- `data/works.ts`의 배열을 읽어 카드로 보여 주고, Embla 캐러셀로 자동 재생과 스와이프를 지원합니다.
- 카드에 웹 화면과 앱 화면이 모두 있으면 `WEB | APP` 토글로 전환합니다. 앱 화면은 폰 프레임 안에 세로로 표시합니다.
- 카드 하단의 설명 영역은 아코디언입니다. `grid-template-rows: 0fr → 1fr` 트랜지션으로 높이를 애니메이션하고, 닫힌 상태에서는 `inert`로 포커스를 막습니다.
- 이미지는 `loading="lazy"`와 `decoding="async"`를 적용했습니다.

### Skills / About
- 카테고리별 기술 스택과 학력·수상·경력을 데이터 객체로 정의하고 컴포넌트에 props로 넘깁니다.
- 스크롤 진입 효과는 AOS를 씁니다.

### Contact
- `data/contacts.ts`에 링크를 추가하면 카드가 자동으로 늘어납니다.
- 링크 형식(`tel:`, `mailto:`, GitHub 주소)을 보고 종류 라벨을 붙이고, 외부 링크는 `rel="noopener noreferrer"`로 새 탭에서 엽니다.

### 접근성과 반응형
- 시맨틱 태그(`main`, `nav`, `section`, `article`)와 WAI-ARIA(`aria-expanded`, `aria-pressed`, `aria-controls` 등)를 사용했습니다.
- 모든 인터랙티브 요소에 Tab 포커스 스타일과 호버·클릭 트랜지션을 줬습니다.
- 320px부터 1280px까지 레이아웃 오버플로우, 터치 타겟 크기, 포커스 가림을 점검해 수정했습니다.
- `useSeoMeta`로 title·description을 지정했습니다.

## 프로젝트 구조

```
├── pages/index.vue          메인 페이지: 섹션 조립, 스크롤·옵저버·AOS 초기화
├── components/
│   ├── MainAside.vue        섹션 내비게이션
│   ├── MainAbout.vue        학력·수상·경력
│   ├── MainSkill.vue        기술 스택
│   ├── MainWorks.vue        프로젝트 캐러셀
│   ├── MainContact.vue      연락처
│   ├── MainSectionTitle.vue 섹션 제목
│   └── ui/                  Embla 캐러셀 래퍼
├── data/                    works.ts, contacts.ts — 콘텐츠만 수정하는 곳
├── structure/user.ts        데이터 타입 정의
├── assets/scss/             전역 스타일, 색상 변수, 아이콘(mask 기반)
└── public/works/            프로젝트 화면 이미지
```

콘텐츠(프로젝트, 연락처)는 `data/`만 고치면 되고, 컴포넌트는 건드리지 않아도 됩니다.

## 실행

```bash
pnpm install
pnpm dev        # http://localhost:3004
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과 미리보기
```

## 프로젝트 추가하기

`data/works.ts`에 항목을 추가하고 이미지를 `public/works/`에 넣습니다. `appImage`는 앱 화면이 있을 때만 넣으면 됩니다.

```ts
{
    name: "프로젝트명",
    period: "2026. 10.",
    summary: "한두 문장 소개",
    stack: ["Nuxt", "TypeScript"],
    webImage: "/works/name.jpg",
    appImage: "/works/name-app.jpg",
    links: [{ label: "GitHub", href: "https://github.com/..." }],
}
```
