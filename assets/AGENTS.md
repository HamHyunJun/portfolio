# assets

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
전역 스타일과 정적 이미지/아이콘.

## Key Files
| File | Description |
|------|-------------|
| `scss/main.scss` | 전역 진입점. `:root` 색상·라운드 CSS 변수, 폰트(Pretendard), body 다크 배경 |
| `scss/normalize.scss` | 리셋 |
| `scss/icons.scss` | `generateIcon` mixin + `.icon`(mask 기반, `currentColor`) 및 아이콘별 클래스 |
| `images/icons/icon_*.svg` | awards, books, code, education, plus, tool, work |

## For AI Agents

### Working In This Directory
- 새 아이콘: `images/icons/icon_<name>.svg` 추가 후 `icons.scss`에 `.icon-<name>` 클래스 등록(`generateIcon`).
- 색상은 하드코딩 대신 `main.scss`의 변수에 추가/사용.
- `main.scss`는 `nuxt.config.ts`의 `css`로 전역 로드됨.

### Testing Requirements
- `yarn dev`로 시각 확인.

## Dependencies

### External
- sass-embedded

## Manual Notes
