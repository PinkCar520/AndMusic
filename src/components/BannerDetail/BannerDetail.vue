<template>
    <div class="banner">
        <div class="banner-logo">
            <img :src="unifyData.coverImgUrl" loading="lazy" />
        </div>
        <!-- 排行榜信息 -->
        <div class="banner-info">
            <div>
                <h2>{{ unifyData.name }}</h2>
            </div>
            <!-- 图标-link-更新时间 -->
            <div class="banner-brief">
                <div class="avatar">
                    <img :src="unifyData.avatarUrl" loading="lazy" />
                    <a href="https://music.163.com/#/user/home?id=1">网易云音乐</a>
                    <span class="update-time">最近更新：{{ showDate(unifyData.updateTime) }}</span>
                </div>
                <div class="description">
                    <p>歌单详情:</p>
                    <div class="info">{{ unifyData.description }}</div>
                </div>
                <!-- 按钮交互逻辑放在最后,便于点击 -->
                <div class="buttons">
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { formatDate } from "@/utils/common";
import { reactive, computed } from 'vue'
import { useBaseStore } from "@/stores/user";
defineProps({
    unifyData: {
        type: Object,
        default: {},
        required: true
    },
})
const store = useBaseStore()
const btnList = reactive(
    [
        {
            id: 1,
            value: "play"
        },
        {
            id: 2,
            value: "collect"
        },
        {
            id: 3,
            value: "gambit"
        },
    ],
);
const showDate = computed(() => {
    return function (value: number) {
        return formatDate(value)
    }
});
</script>
<style lang="scss" scoped>
// banner 部分
.banner {
    width: 1180px;
    padding: 64px 0;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.5fr 1.5fr;
    grid-column-gap: 40px;

    & .banner-logo {
        // logo部分
        width: 290px;
        height: 290px;

        & img {
            width: 290px;
            height: 100%;
            border-radius: 10px;
            box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
        }
    }

    & .banner-info {
        // 榜单信息
        width: 420px;
        height: 100%;
        padding: 8px 32px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        & h2 {
            font-weight: 500;
            color: #444;
            width: calc(100% - 5px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 5px 0;
            font-size: 30px;
        }

        & .banner-brief {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;

            // 图标-link-更新时间
            & .avatar {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                & img {
                    height: 32px;
                    border-radius: 50px;
                }

                & a {
                    color: #0c73c2;
                    padding: 3.2px 0;
                    text-decoration: none;
                    font-size: 18px;
                }

                & span {
                    color: #444;
                    font-size: 18px;
                }
            }

            & .description {
                padding: 5px 0;

                & p {
                    color: #707070;
                    font-size: 14px;
                    padding: 5px 0;
                }

                & .info {
                    font-size: 14px;
                    opacity: 0.7;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    cursor: pointer;
                }
            }

            & .buttons {
                width: 100%;
                height: 40px;
                margin: 10px 0;

                & button {
                    width: 100px;
                    height: 40px;
                    border-radius: 20px;
                    border: none;
                    margin-right: 8px;
                    color: #fff;
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.01);
                    cursor: pointer;
                    transition: all 0.2s linear;
                }

                & .btn-active {
                    background-color: rgb(253, 67, 67);
                }
            }

            & button:hover {
                transform: scale(1.05);
            }
        }
    }

    & .banner-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px 10px;
        height: 290px;
        padding: 32px 16px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.05);

        & button {
            height: 80px;
            border: none;

            & img {
                width: 100%;
                height: 100%;
                border-radius: 10px;
            }
        }
    }
}
</style>