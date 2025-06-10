<template>
    <main class="main-page">
        <section class="section" id="main-home">
            <MainHome :home-data="homeData" />
        </section>
        <section class="section color" id="main-about">
            <MainAbout :about-data="aboutData" />
        </section>
        <section class="section" id="main-works">
            <MainWorks />
        </section>
        <section class="section" id="main-skill">
            <MainSkill />
        </section>
        <section class="section" id="main-contact">Contact section</section>
    </main>
</template>

<script setup lang="ts">
    import type { MainAboutData, MainHomeData } from "~/structure/user"

    definePageMeta({
        layout: "default",
    })

    const homeData = computed<MainHomeData>(() => ({
        title: "Front-End Developer",
        desc: "<span class='text-accent'>열정</span>은 기본, 모든 것은 <span class='text-accent'>결과</span>로 보여드립니다.",
        tags: ["프론트", "개발자", "차별화", "집요함", "성장"],
        details: [
            "꾸준한 노력과 성장을 갈망하고 있습니다.",
            "올바른 목적과 방향으로 나아가고자 노력하고 있습니다.",
            "맡은 일에 항상 최선을 다하고 책임감 있게 해결해 나갑니다.",
            "노력, 열정, 차별화 모든 것은 결과로 보여드리겠습니다.",
        ],
    }))

    const aboutData = computed<MainAboutData>(() => ({
        education: [
            { date: "2016. 02.", detail: "효원고등학교 졸업" },
            { date: "2021. 02.", detail: "오산대학교 스마트IT과 졸업" },
        ],
        awards: [
            { date: "2017. 06.", detail: "Mos PowerPoint 2급" },
            { date: "2017. 06.", detail: "Mos Exel 2급" },
            {
                date: "2017. 11.",
                detail: "대학생 디지털 솔루션 챌린지(K-Hackathon) 워크숍 우수상 수상",
            },
            { date: "2020. 06.", detail: "LINC+ 진로 설계 경진대회 장려상 수상" },
            { date: "2020. 10.", detail: "LINC+ 현장실습 수기 공모전 최우수상 수상" },
            { date: "2020. 11.", detail: "교내 창업 아이디어 경진대회 우수상 수상" },
        ],
        works: [
            { date: "2024. 04. ~", detail: "크리에이블 개발팀 근무중" },
            { date: "2023. 11. ~ 2024. 02.", detail: "오케스트로 Platform Dev3팀 근무" },
            { date: "2022. 03. ~ 2023. 08.", detail: "아이오비 플랫폼 개발팀 근무" },
            { date: "2020. 12. ~ 2022. 03.", detail: "중외정보기술 S&P 사업팀 근무" },
        ],
    }))
</script>

<style lang="scss" scoped>
    .main-page {
        .section {
            padding: 150px 0;

            &.color {
                background: var(--white);
            }
        }
    }
</style>
