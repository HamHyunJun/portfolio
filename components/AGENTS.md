# components

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
페이지 섹션 및 공용 UI 컴포넌트. `pathPrefix: false`라 `components/ui/` 하위도 파일명 그대로(`<UICarousel>`) 사용한다.

## Key Files
| File | Description |
|------|-------------|
| `MainAbout.vue` | 학력·수상·경력 목록. `MainAboutData` props |
| `MainSkill.vue` | 카테고리별 스킬 목록. `MainSkillData[]` props |
| `MainWorks.vue` | Works 캐러셀(현재 picsum 더미 이미지 3개) |
| `MainAside.vue` | 좌측 섹션 내비(ABOUT/SKILLS/WORKS). `activeSection` prop, `select` emit |
| `MainSectionTitle.vue` | 구분선 + 섹션 제목. `title` prop |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `ui/` | 범용 UI 래퍼 (see `ui/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 새 섹션은 `Main<Name>.vue`로 만들고 `pages/index.vue`에서 조립.
- 데이터 형태는 `~/structure/user.ts` 타입을 import하여 props 타입으로 사용.
- 색상/라운드는 `main.scss`의 CSS 변수(`--white`, `--gray`, `--rounded-*`) 사용.

### Testing Requirements
- `yarn dev`로 브라우저 확인(스크롤/활성 섹션/캐러셀).

### Common Patterns
- 클래스 네이밍: `<block>-<element>` 중첩 SCSS.

## Dependencies

### Internal
- `~/structure/user`, `~/assets/scss/main.scss` 변수, `ui/`

### External
- embla-carousel

## Manual Notes
