<template>
    <div class="skill">
        <MainSectionTitle title="SKILLS" no="02" />
        <div class="skill-contents">
            <div
                v-for="skill in skillData"
                :key="skill.category"
                class="skill-content"
                :style="{ '--tone': toneOf(skill.category) }"
                data-aos="fade-up"
            >
                <div class="content-category-wrap">
                    <i class="icon" :class="categoryIcon(skill.category)"></i>
                    <p class="category-title">{{ skill.category }}</p>
                </div>
                <div class="chips" role="group" :aria-label="`${skill.category} 기술`">
                    <button
                        v-for="detail in skill.data"
                        :key="detail.name"
                        type="button"
                        class="chip"
                        :class="{ active: selectedOf(skill).name === detail.name }"
                        :aria-pressed="selectedOf(skill).name === detail.name"
                        @click="selected[skill.category] = detail.name"
                    >
                        {{ detail.name }}
                    </button>
                </div>
                <!-- PDF(인쇄)에서는 클릭할 수 없으므로 모든 기술의 설명을 펼쳐 보여 준다 -->
                <ul class="print-list" aria-hidden="true">
                    <li v-for="detail in skill.data" :key="detail.name">
                        <p class="print-name">{{ detail.name }}</p>
                        <p class="print-desc">{{ detail.desc }}</p>
                    </li>
                </ul>
                <div class="detail" aria-live="polite">
                    <!-- 모든 설명을 같은 칸에 겹쳐 두면 가장 긴 설명 기준으로 높이가 고정된다 -->
                    <div
                        v-for="item in skill.data"
                        :key="item.name"
                        class="detail-inner"
                        :class="{ active: selectedOf(skill).name === item.name }"
                    >
                        <div class="detail-head">
                            <p class="detail-logo">{{ item.logoText }}</p>
                            <p class="detail-name">{{ item.name }}</p>
                        </div>
                        <p class="detail-desc">{{ item.desc }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { MainSkillData, MainSkillDataDetail } from "~/structure/user"

    defineProps<{
        skillData: MainSkillData[]
    }>()

    // 카테고리마다 선택된 기술 이름. 선택 전에는 첫 번째 기술을 보여 준다
    const selected = reactive<Record<string, string>>({})

    const selectedOf = (skill: MainSkillData): MainSkillDataDetail =>
        skill.data.find((d): boolean => d.name === selected[skill.category]) ?? skill.data[0]

    // 카테고리마다 팔레트 색 하나(파랑/그린/주황)를 칩·패널에 쓴다
    const toneOf = (category: MainSkillData["category"]): string => {
        if (category === "Languages") return "var(--blue)"
        else if (category === "Frameworks & Libraries") return "var(--green)"
        else return "var(--orange)"
    }

    const categoryIcon = (category: MainSkillData["category"]): string => {
        if (category === "Languages") return "icon-code"
        else if (category === "Frameworks & Libraries") return "icon-books"
        else return "icon-tool"
    }
</script>

<style lang="scss" scoped>
    .skill {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .skill-contents {
            display: flex;
            flex-direction: column;
            gap: 40px;

            .skill-content {
                display: flex;
                flex-direction: column;
                gap: 16px;

                .content-category-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .category-title {
                        min-width: 0;
                        font-family: var(--mono);
                        font-size: 20px;
                        line-height: 1.4;
                        font-weight: 700;

                        // 좁은 화면에서도 아이콘·제목이 겹치지 않고 한 줄에 들어오게 줄인다
                        @media (max-width: 480px) {
                            font-size: 16px;
                        }

                        &::before {
                            content: "// ";
                            color: var(--tone);
                        }
                    }
                }

                .chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;

                    .chip {
                        padding: 6px 12px;
                        border: 1px solid var(--line);
                        border-radius: 4px;
                        background: var(--gray);
                        font-family: var(--mono);
                        font-size: 13px;
                        color: var(--primary);
                        cursor: pointer;
                        transition:
                            color 0.2s ease,
                            background-color 0.2s ease,
                            border-color 0.2s ease,
                            transform 0.2s ease;

                        &:hover {
                            color: var(--white);
                            border-color: var(--tone);
                        }

                        &:active {
                            transform: scale(0.95);
                        }

                        &:focus-visible {
                            outline: 2px solid var(--white);
                            outline-offset: 2px;
                        }

                        &.active {
                            color: var(--tone);
                            border-color: var(--tone);
                            background: color-mix(in srgb, var(--tone) 14%, transparent);
                        }
                    }
                }

                .print-list {
                    display: none;
                    margin: 0;
                    padding: 0;
                    list-style: none;

                    li {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        margin-bottom: 8px;
                        padding-left: 12px;
                        border-left: 2px solid var(--tone);
                        break-inside: avoid;
                    }

                    .print-name {
                        font-family: var(--mono);
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--white);
                    }

                    .print-desc {
                        font-size: 13px;
                        line-height: 150%;
                        color: var(--primary);
                    }
                }

                .detail {
                    display: grid;
                    padding: 16px 20px;
                    background: var(--gray);
                    border: 1px solid var(--line);
                    border-left: 2px solid var(--tone);
                    border-radius: 6px;

                    .detail-inner {
                        grid-area: 1 / 1;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        opacity: 0;
                        visibility: hidden;
                        transform: translateY(6px);
                        transition:
                            opacity 0.2s ease,
                            transform 0.2s ease,
                            visibility 0.2s;

                        &.active {
                            opacity: 1;
                            visibility: visible;
                            transform: none;
                        }
                    }

                    .detail-head {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .detail-logo {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        height: 30px;
                        border-radius: var(--rounded-2xs);
                        font-family: var(--mono);
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--tone);
                        background: color-mix(in srgb, var(--tone) 15%, transparent);
                        border: 1px solid color-mix(in srgb, var(--tone) 40%, transparent);
                    }

                    .detail-name {
                        font-family: var(--mono);
                        font-size: 16px;
                        font-weight: 700;
                        color: var(--white);
                    }

                    .detail-desc {
                        font-size: 14px;
                        line-height: 160%;
                        word-break: keep-all;
                        color: var(--white);
                    }
                }
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .skill .detail-inner,
        .skill .chip {
            transition-duration: 0.01ms;
        }
    }
</style>
