# pages

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
파일 기반 라우팅 페이지.

## Key Files
| File | Description |
|------|-------------|
| `index.vue` | 메인 단일 페이지. 보드(HAM / HYUN JUN) + `MainAside` + About/Skill/Works 섹션. 데이터는 이 파일에서 `computed`로 정의해 props로 전달. AOS 초기화, Lenis 스무스 스크롤, IntersectionObserver로 `activeSection` 추적 |

## For AI Agents

### Working In This Directory
- 콘텐츠 데이터(`aboutData`, `skillData`)를 수정하려면 이 파일을 편집하고 타입은 `~/structure/user`와 맞출 것.
- `Window.Lenis`는 `global.d.ts`에 `any`로 선언되어 있음(외부 스크립트 로드 가정).
- DOM 의존 코드(AOS, observer, Lenis)는 클라이언트 훅(`onMounted`)에서만 실행.

### Testing Requirements
- `yarn dev` 후 스크롤 시 aside 활성 표시와 섹션 이동 확인.

## Dependencies

### Internal
- `components/Main*`, `~/structure/user`

### External
- aos

## Manual Notes
