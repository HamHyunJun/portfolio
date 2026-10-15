# components

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
페이지 섹션 및 공용 UI 컴포넌트. `pathPrefix: false`라 `components/ui/` 하위도 파일명 그대로(`<UICarousel>`) 사용한다.

## Key Files
| File | Description |
|------|-------------|
| `MainAbout.vue` | 경력·수상·학력 목록(경력은 `points` 성과 포함). `MainAboutData` props |
| `MainSkill.vue` | 카테고리별 칩 + 선택한 기술의 상세 패널(PDF에서는 전체 설명 펼침). `MainSkillData[]` props |
| `MainWorks.vue` | Works 캐러셀 + 카드 아코디언. `data/works.ts`의 `companyWorks`/`sideWorks`를 그룹별 캐러셀로 표시하고, 비어 있는 그룹은 숨김. 둘 다 비면 빈 상태 문구 |
| `MainContact.vue` | 하단 연락 링크(`data/contacts.ts`)와 PDF 저장 버튼. 데이터가 없으면 렌더링 안 함 |
| `MainAside.vue` | VS Code 탐색기 스타일 섹션 내비(`<nav>`+`<button>`). 데스크톱은 좌측 sticky, 768px 이하는 하단 고정 바. `files`·`activeSection` prop, `select` emit |
| `MainTabs.vue` | 에디터 상단 탭 바(활성 섹션 = 활성 탭). 모바일에서는 숨김 |
| `MainStatusBar.vue` | 화면 하단 고정 상태바(`Ln N`, 현재 파일). 모바일에서는 숨김 |
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
- `pnpm dev`로 브라우저 확인(스크롤/활성 섹션/캐러셀).

### Common Patterns
- 클래스 네이밍: `<block>-<element>` 중첩 SCSS.

## Dependencies

### Internal
- `~/structure/user`, `~/assets/scss/main.scss` 변수, `ui/`

### External
- embla-carousel

## Manual Notes
