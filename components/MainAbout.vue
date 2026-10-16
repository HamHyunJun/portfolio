<template>
    <div class="about">
        <MainSectionTitle title="ABOUT ME" no="01" />
        <div class="about-contents" data-aos="fade-up">
            <div class="contents-title-container">
                <i class="icon icon-work"></i>
                <h3 class="contents-title">경력</h3>
            </div>
            <ul class="contents-desc-container">
                <li
                    v-for="(work, index) in aboutData.works"
                    :key="index"
                    class="contents-desc-wrap"
                >
                    <p class="contents-desc">
                        {{ work.date }}
                        <span class="desc-period">{{ periodOf(work.date) }}</span>
                    </p>
                    <div class="contents-desc-body">
                        <p class="contents-desc-detail">{{ work.detail }}</p>
                        <ul v-if="work.points?.length" class="contents-points">
                            <li v-for="point in work.points" :key="point">{{ point }}</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div class="about-contents" data-aos="fade-up" data-aos-delay="100">
            <div class="contents-title-container">
                <i class="icon icon-awards"></i>
                <h3 class="contents-title">자격 및 수상</h3>
            </div>
            <ul class="contents-desc-container">
                <li
                    v-for="(award, index) in aboutData.awards"
                    :key="index"
                    class="contents-desc-wrap"
                >
                    <p class="contents-desc">{{ award.date }}</p>
                    <p class="contents-desc-detail">{{ award.detail }}</p>
                </li>
            </ul>
        </div>
        <div class="about-contents" data-aos="fade-up" data-aos-delay="200">
            <div class="contents-title-container">
                <i class="icon icon-education"></i>
                <h3 class="contents-title">학력</h3>
            </div>
            <ul class="contents-desc-container">
                <li
                    v-for="(edu, index) in aboutData.education"
                    :key="index"
                    class="contents-desc-wrap"
                >
                    <p class="contents-desc">{{ edu.date }}</p>
                    <p class="contents-desc-detail">{{ edu.detail }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { MainAboutData } from "~/structure/user"

    defineProps<{
        aboutData: MainAboutData
    }>()

    // "2020. 12. ~ 2022. 03." 형식에서 시작·끝 달을 포함해 근무 기간을 계산한다. 끝이 없으면 이번 달까지
    const periodOf = (date: string): string => {
        const [start, end] = date.split("~").map((part): number[] | undefined => {
            const m = part.match(/(\d{4})\.\s*(\d{2})/)
            return m ? [Number(m[1]), Number(m[2])] : undefined
        })
        if (!start) return ""
        const now = new Date()
        const [endYear, endMonth] = end ?? [now.getFullYear(), now.getMonth() + 1]
        const total = (endYear - start[0]) * 12 + (endMonth - start[1]) + 1
        const years = Math.floor(total / 12)
        const months = total % 12
        return [years && `${years}년`, months && `${months}개월`].filter(Boolean).join(" ")
    }
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
            gap: 40px;

            @media (max-width: 1100px) {
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
                // 내용 길이와 상관없이 세 블록의 제목 폭을 같게 고정해 세로선 위치를 맞춘다
                width: 150px;
                flex-shrink: 0;
                height: 70px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                white-space: nowrap;

                @media (max-width: 1100px) {
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
                margin: 0;
                list-style: none;

                // 남은 폭을 모두 차지해 글이 길어도 짧아도 세로선 위치가 같다
                @media (min-width: 1101px) {
                    flex: 1;
                    min-width: 0;
                }
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

                    @media (max-width: 1100px) {
                        gap: 12px;
                    }

                    // 아주 좁은 화면은 날짜 칸이 내용 폭을 너무 줄이므로 내용을 날짜 아래로 내린다
                    @media (max-width: 480px) {
                        flex-direction: column;
                        gap: 4px;
                    }

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

                        // 모바일은 12자 폭으로 좁혀 "2023. 11. ~ / 2024. 02."처럼 두 줄로 접고, 내용 폭을 넓힌다
                        @media (max-width: 1100px) {
                            flex-basis: 12ch;
                            white-space: normal;
                        }

                        @media (max-width: 480px) {
                            flex-basis: auto;
                            white-space: nowrap;
                        }
                        font-family: var(--mono);
                        font-size: 12px;
                        line-height: normal;
                        color: var(--green);

                        .desc-period {
                            display: block;
                            margin-top: 4px;
                            font-size: 11px;
                            color: var(--white);
                        }
                    }

                    .contents-desc-body {
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }

                    .contents-points {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        margin: 0;
                        padding: 0;
                        list-style: none;

                        li {
                            position: relative;
                            padding-left: 16px;
                            font-size: 13px;
                            line-height: 160%;
                            word-break: keep-all;
                            color: var(--white);

                            &::before {
                                content: "›";
                                position: absolute;
                                left: 0;
                                font-family: var(--mono);
                                color: var(--green);
                            }
                        }
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
