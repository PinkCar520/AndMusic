<template>
    <div class="daily-music">
        <!-- title -->
        <h1 class="daily-title">每日推荐</h1>
        <!-- 歌曲列表 -->
        <TrackList :tracksData="userRecommendSongsList"></TrackList>
    </div>
</template>
<script>
import TrackList from "@/components/TrackList/TrackList.vue";
import { getUserRecommendSongsListAPI } from "@/api/user"
export default {
    name: "DailyMusic",
    components: {
        TrackList,
    },
    data() {
        return {
            // 每日推荐歌曲
            userRecommendSongsList: [],
        };
    },
    created() {
        this.getUserRecommendSongsList()
    },
    methods: {
        // 获取每日推荐歌曲
        async getUserRecommendSongsList() {
            const { data: res } = await getUserRecommendSongsListAPI()
            this.userRecommendSongsList = res.data.dailySongs
        },
    }
}
</script>
<style lang="scss" scoped>
.daily-title {
    width: 1180px;
    padding: 100px 0;
    margin: 100px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ec4141;
    font-size: 30px;
    background-color: #fff;
    border-radius: 15px;
}
</style>