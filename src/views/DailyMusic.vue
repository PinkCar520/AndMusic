<template>
    <div class="daily-music">
        <div class="daily-box">
            <div class="daily-title">
                <h1>每日推荐</h1>
            </div>
            <!-- 歌曲列表 -->
            <div class="track-list">
                <!-- 渲染歌曲区域 -->
                <div class="track-item" v-for="(track, index) in userRecommendSongsList" :key="track.id"
                    @click="selectTrack(track.id, index)" :class="{ copy: track.copyright == isCopyright }">
                    <div class="play track-play"
                        :class="{ copy: track.copyright == isCopyright, disabled: track.copyright == isCopyright }"
                        title="">
                        <button>
                            <svg-icon icon-class="play"></svg-icon>
                        </button>
                        <img :src="track.al.picUrl + '?param=112y112'" class="lazy-img animated-bg" loading="lazy" />
                    </div>
                    <div class="track-info">
                        <h3 class="song-name">{{ track.name }}</h3>
                        <p>{{ track.ar[0].name }}</p>
                        <!-- <div class="item-id">{{ track.copyright }}</div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getUserRecommendSongsListAPI } from "@/api/user"
export default {
    data() {
        return {
            // 每日推荐歌曲
            userRecommendSongsList: [],
            // 版权信息检验 1 = VIP付费音乐
            isCopyright: true,
        };
    },
    created() {
        this.getUserRecommendSongsList()
    },
    methods: {
        // 获取每日推荐歌曲
        async getUserRecommendSongsList() {
            const { data: res } = await getUserRecommendSongsListAPI()
            console.log(res);
            this.userRecommendSongsList = res.data.dailySongs
            console.log('用户每日推荐歌曲--', this.userRecommendSongsList);
        },
        selectTrack(value) {
            this.$store.dispatch("MusicId", value);
        }
    }
}
</script>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

.daily-music {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    padding-bottom: 80px;

    & .daily-box {
        width: 1180px;
        margin: auto;
        display: flex;
        flex-direction: column;

        & .daily-title {
            position: relative;
            width: 100%;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ec4141;
            font-size: 30px;
            background-color: #fff;
            margin: 100px 0;
            border-radius: 15px;

            & h1 {
                position: absolute;
                z-index: 1;
            }
        }

        // track-list 部分
        & .track-list {
            width: 100%;
            height: 100%;
            padding-bottom: 5rem;
            margin: auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 20px;
            cursor: pointer;

            & .track-item {
                height: 80px;
                display: flex;
                flex: 1 1 auto;
                background-color: #fff;
                box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.01);
                border-radius: 10px;

                & img {
                    height: 80px;
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
                }

                & .track-info {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;
                    // background-color: #fff;
                    border-top-right-radius: 10px;
                    border-bottom-right-radius: 10px;
                    padding: 0px 2rem;

                    & h3 {
                        width: 120px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-weight: 500;
                        margin: 0.3rem 0em;
                        font-size: 16px;
                    }

                    & span {
                        color: #707070;
                        padding: 5px 0;
                        font-size: 13px;
                    }
                }
            }
        }
    }
}

.track-play {
    width: 80px;

    & button {
        cursor: pointer;
    }

    & img {
        width: 100%;
    }
}
</style>