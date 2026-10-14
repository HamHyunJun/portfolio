<template>
    <div class="skill">
        <MainSectionTitle title="SKILLS" />
        <div class="skill-contents">
            <div v-for="(skill, index) in skillData" :key="index" class="skill-content">
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
                        font-size: 24px;
                        line-height: 0;
                        font-weight: 700;
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
                        border-radius: var(--rounded-sm);
                        display: flex;
                        flex-direction: column;
                        gap: 10px;

                        .detail-logo {
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
                                font-size: 18px;
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
