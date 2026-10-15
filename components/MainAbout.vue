<template>
    <div class="about">
        <MainSectionTitle title="ABOUT ME" no="01" />
        <div class="about-contents">
            <div class="contents-title-container">
                <i class="icon icon-education"></i>
                <h3 class="contents-title">학력</h3>
            </div>
            <div class="contents-desc-container">
                <div
                    v-for="(edu, index) in aboutData.education"
                    :key="index"
                    class="contents-desc-wrap"
                >
                    <span class="contents-desc">{{ edu.date }}</span>
                    <span class="contents-desc-detail">{{ edu.detail }}</span>
                </div>
            </div>
        </div>
        <div class="about-contents">
            <div class="contents-title-container">
                <i class="icon icon-awards"></i>
                <h3 class="contents-title">자격 및 수상</h3>
            </div>
            <div class="contents-desc-container">
                <div
                    v-for="(award, index) in aboutData.awards"
                    :key="index"
                    class="contents-desc-wrap"
                >
                    <span class="contents-desc">{{ award.date }}</span>
                    <span class="contents-desc-detail">{{ award.detail }}</span>
                </div>
            </div>
        </div>
        <div class="about-contents">
            <div class="contents-title-container">
                <i class="icon icon-work"></i>
                <h3 class="contents-title">경력</h3>
            </div>
            <div class="contents-desc-container">
                <div
                    v-for="(work, index) in aboutData.works"
                    :key="index"
                    class="contents-desc-wrap"
                >
                    <span class="contents-desc">{{ work.date }}</span>
                    <span class="contents-desc-detail">{{ work.detail }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { MainAboutData } from "~/structure/user"

    defineProps<{
        aboutData: MainAboutData
    }>()
</script>

<style lang="scss" scoped>
    .about {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .about-contents {
            padding: 18px 18px 18px 36px;
            display: flex;
            gap: 60px;

            @media (max-width: 768px) {
                flex-direction: column;
                gap: 12px;
                padding: 0;
                // 제목 묶음 사이를 벌려 내용과 다음 제목이 붙어 보이지 않게 한다
                margin-bottom: 28px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            .contents-title-container {
                width: 200px;
                height: 70px;
                display: flex;
                align-items: flex-start;
                gap: 18px;

                @media (max-width: 768px) {
                    width: auto;
                    height: auto;
                    align-items: center;
                }

                .contents-title {
                    font-size: 18px;
                    font-weight: bold;
                }
            }

            .contents-desc-container {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 14px;
                padding-left: 28px;
                border-left: 1px solid var(--line);

                .contents-desc-wrap {
                    display: flex;
                    position: relative;
                    align-items: flex-start;
                    gap: 16px;

                    // 타임라인 점
                    &::before {
                        content: "";
                        position: absolute;
                        top: 6px;
                        left: -33px;
                        width: 9px;
                        height: 9px;
                        border-radius: 2px;
                        background: var(--base-background);
                        border: 2px solid var(--green);
                        transition:
                            background-color 0.25s ease,
                            transform 0.25s ease;
                    }

                    &:hover::before {
                        background: var(--green);
                        transform: scale(1.3);
                    }

                    .contents-desc {
                        // 상세 글이 길어도 날짜가 줄바꿈되지 않도록 폭을 고정한다
                        flex: 0 0 156px;
                        white-space: nowrap;
                        font-family: var(--mono);
                        font-size: 12px;
                        line-height: normal;
                        color: var(--green);
                    }

                    .contents-desc-detail {
                        min-width: 0;
                        word-break: keep-all;
                        font-size: 15px;
                        font-weight: 600;
                    }
                }
            }
        }
    }
</style>
