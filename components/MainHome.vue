<template>
    <div class="home">
        <img src="https://dummyimage.com/500x500/000/fff" class="home-image" />
        <div class="home-contents">
            <h2 class="contents-title">{{ homeData.title }}</h2>
            <p class="contents-desc" v-html="homeData.desc"></p>
            <div class="contents-tag-container">
                <span v-for="(tag, index) in homeData.tags" :key="index" class="contents-tag"
                    >#{{ tag }}</span
                >
            </div>
            <div class="divider"></div>
            <ul class="contents-detail-container">
                <li
                    v-for="(detail, index) in homeData.details"
                    :key="index"
                    class="contents-detail"
                >
                    {{ detail }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { MainHomeData } from "~/structure/user"

    defineProps<{
        homeData: MainHomeData
    }>()
</script>

<style lang="scss" scoped>
    .home {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 25px;

        .home-image {
            width: 400px;
            height: 500px;
            object-fit: cover;
            border-radius: var(--rounded);
        }

        .home-contents {
            flex: 1;
            padding: 30px;

            .contents-title {
                font-size: 34px;
                font-weight: bold;
            }

            .contents-desc {
                margin-top: 8px;
                font-size: 24px;
                font-weight: bold;
            }

            .contents-tag-container {
                margin-top: 12px;
                display: flex;
                gap: 8px;

                .contents-tag {
                    padding: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1;
                    color: var(--blue);
                    border-radius: var(--rounded);
                    background: var(--blue-dim);
                }
            }

            .contents-detail-container {
                margin-top: 16px;
                padding-left: 21px;
                list-style: disc;

                .contents-detail {
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 210%;
                }
            }
        }

        .divider {
            width: 100%;
            height: 1px;
            margin: 24px 0;
            border-radius: var(--rounded-sm);
            background: var(--blue);
        }
    }
</style>
