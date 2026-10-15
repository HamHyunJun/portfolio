# ui

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
도메인에 속하지 않는 범용 UI 컴포넌트(`UI` 접두사).

## Key Files
| File | Description |
|------|-------------|
| `UICarousel.vue` | Embla 래퍼(loop, center, autoplay 3초). `change(index)` emit, 언마운트 시 destroy |
| `UICarouselSlide.vue` | 슬라이드 아이템(`flex: 0 0 80%`) |

## For AI Agents

### Working In This Directory
- `UICarousel`은 `onMounted`에서 초기화하고 `onBeforeUnmount`에서 destroy한다.
- 새 컴포넌트는 `UI` 접두사 유지.

### Testing Requirements
- `pnpm dev`로 수동 확인.

## Dependencies

### External
- embla-carousel, embla-carousel-autoplay

## Manual Notes
