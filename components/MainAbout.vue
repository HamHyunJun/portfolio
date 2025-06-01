<template>
    <div class="about">
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
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .about-contents {
            padding: 18px;
            display: flex;
            gap: 60px;

            .contents-title-container {
                width: 200px;
                height: 70px;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 18px;
                border-radius: var(--rounded);
                background: var(--blue-dim);

                .contents-title {
                    font-size: 18px;
                    font-weight: bold;
                }
            }

            .contents-desc-container {
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 10px;

                .contents-desc-wrap {
                    display: flex;
                    align-items: center;
                    gap: 16px;

                    .contents-desc {
                        padding: 8px;
                        border-radius: var(--rounded);
                        background: var(--blue-dim);
                        font-size: 13px;
                        font-weight: 600;
                        line-height: normal;
                        color: var(--blue);
                    }

                    .contents-desc-detail {
                        font-size: 15px;
                        font-weight: 600;
                    }
                }
            }
        }
    }
</style>
