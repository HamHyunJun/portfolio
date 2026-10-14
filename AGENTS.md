# portfolio

**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
Nuxt 3 기반 개인 포트폴리오 사이트(다크 테마, 단일 페이지: Home → About → Skills → Works). AOS, Embla Carousel 사용. 패키지 매니저는 yarn.

## Key Files
| File | Description |
|------|-------------|
| `nuxt.config.ts` | dev 포트 3004, `~/components` 자동 import(`pathPrefix: false`), `main.scss` 전역 CSS |
| `app.vue` | `NuxtLayout` + `NuxtPage` 루트 |
| `global.d.ts` | `aos` 모듈 타입, `Window.Lenis`/`Bootpay` 선언 |
| `.prettierrc.json` | 들여쓰기 4칸, 세미콜론 없음, 큰따옴표, printWidth 100, vue script/style 들여쓰기 |
| `package.json` | scripts: `dev`, `build`, `generate`, `preview` (테스트/린트 없음) |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `assets/` | SCSS, 아이콘 SVG, 로고 (see `assets/AGENTS.md`) |
| `components/` | Vue 컴포넌트 (see `components/AGENTS.md`) |
| `layouts/` | Nuxt 레이아웃 (see `layouts/AGENTS.md`) |
| `pages/` | 라우트 페이지 (see `pages/AGENTS.md`) |
| `structure/` | 데이터 타입 정의 (see `structure/AGENTS.md`) |
| `data/` | 사용자가 채우는 콘텐츠: `works.ts`(프로젝트), `contacts.ts`(연락 링크) |
| `public/`, `server/` | 정적 파일(favicon, robots.txt) / tsconfig만 존재 |

## For AI Agents

### Working In This Directory
- 모든 설명·주석·커밋 메시지는 한국어.
- 스타일: Prettier 설정 준수(4칸, no semi, 큰따옴표). SFC는 `<script setup lang="ts">` + `<style lang="scss" scoped>`.
- YAGNI: 외부 라이브러리 추가 지양, 표준/브라우저 API 우선.
- UI: 모든 인터랙션에 트랜지션 부여, 시맨틱 HTML·ARIA·키보드 접근성 준수.
- ref/computed/onMounted 등은 Nuxt auto-import 사용(명시 import 불필요).

### Testing Requirements
- 테스트 러너 없음. `yarn build`로 빌드/타입 확인, `yarn dev`(포트 3004)로 수동 확인.

### Common Patterns
- 섹션 컴포넌트 `Main*`이 `pages/index.vue`에서 props로 데이터를 받음.
- 아이콘은 `<i class="icon icon-<name>">` (CSS mask, `currentColor`).

## Dependencies

### External
- nuxt 3, vue, vue-router, aos, embla-carousel(+autoplay), sass-embedded

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
