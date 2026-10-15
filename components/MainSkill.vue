<template>
    <div class="skill">
        <MainSectionTitle title="SKILLS" no="02" />
        <div
            class="skill-contents"
            @pointermove="trackGlow($event, '.content-detail-wrap')"
        >
            <div
                v-for="(skill, index) in skillData"
                :key="index"
                class="skill-content"
                data-aos="fade-up"
            >
                <div class="content-category-wrap">
                    <i class="icon" :class="categoryIcon(skill.category)"></i>
                    <p class="category-title">{{ skill.category }}</p>
                </div>
                <div class="content-details">
                    <div
                        v-for="(detail, detailIndex) in skill.data"
                        :key="detailIndex"
                        class="content-detail-wrap"
                    >
                        <p
                            class="detail-logo"
                            :style="{ background: detail.logoBackground, color: detail.logoColor }"
                        >
                            {{ detail.logoText }}
                        </p>
                        <div class="detail-text-wrap">
                            <p class="text-name">{{ detail.name }}</p>
                            <p class="text-desc">{{ detail.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { MainSkillData } from "~/structure/user"

    defineProps<{
        skillData: MainSkillData[]
    }>()

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
                gap: 30px;

                .content-category-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .category-title {
                        font-family: var(--mono);
                        min-width: 0;
                        font-size: 20px;
                        line-height: 1.4;
                        font-weight: 700;

                        // 좁은 화면에서도 아이콘·제목이 겹치지 않고 한 줄에 들어오게 줄인다
                        @media (max-width: 480px) {
                            font-size: 16px;
                        }

                        &::before {
                            content: "// ";
                            color: var(--green);
                        }
                    }
                }

                .content-details {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    column-gap: 10px;
                    row-gap: 15px;

                    @media (max-width: 1024px) {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    @media (max-width: 480px) {
                        grid-template-columns: 1fr;
                    }

                    .content-detail-wrap {
                        padding: 20px;
                        background: var(--gray);
                        border: 1px solid var(--line);
                        border-radius: 6px;
                        position: relative;
                        overflow: hidden;
                        transition:
                            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                            border-color 0.3s ease,
                            box-shadow 0.3s ease;

                        &:hover {
                            transform: translateY(-4px);
                            border-color: var(--green);
                            box-shadow: 0 12px 28px -12px rgb(63 185 80 / 40%);
                        }
                        display: flex;
                        flex-direction: column;
                        gap: 10px;

                        // 커서를 따라오는 글로우
                        &::before {
                            content: "";
                            position: absolute;
                            inset: 0;
                            pointer-events: none;
                            opacity: 0;
                            background: radial-gradient(
                                200px circle at var(--mx, 50%) var(--my, 50%),
                                rgb(63 185 80 / 18%),
                                transparent 70%
                            );
                            transition: opacity 0.3s ease;
                        }

                        &:hover::before {
                            opacity: 1;
                        }

                        > * {
                            position: relative;
                        }

                        .detail-logo {
                            font-family: var(--mono);
                            font-size: 14px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 30px;
                            height: 30px;
                            border-radius: var(--rounded-2xs);
                        }

                        .detail-text-wrap {
                            display: flex;
                            flex-direction: column;
                            gap: 5px;
                            color: var(--white);

                            .text-name {
                                font-family: var(--mono);
                                font-size: 16px;
                                font-weight: 700;
                            }

                            .text-desc {
                                font-size: 13px;
                                line-height: 140%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
