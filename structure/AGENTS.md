# structure

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-14 · **Updated:** 2026-10-14

## Purpose
화면에 쓰이는 데이터 형태의 TypeScript 인터페이스 모음.

## Key Files
| File | Description |
|------|-------------|
| `user.ts` | `MainAboutData`/`AboutData`, `MainWorkData`/`ContactLink`, `MainSkillData`(category: Languages \| Frameworks & Libraries \| Tools)/`MainSkillDataDetail` |

## For AI Agents

### Working In This Directory
- 타입만 정의(런타임 코드 없음). 필드 변경 시 `pages/index.vue`와 `components/Main*.vue` 동시 수정.
- `MainSkill.vue`의 `categoryIcon`은 `category` 리터럴에 의존하므로 카테고리 추가 시 함께 갱신.

## Manual Notes
