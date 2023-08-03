<template>
    <div class="daily-music">
        <!-- title -->
        <h1 class="daily-title">每日推荐</h1>
        <!-- 歌曲列表 -->
        <TrackList :tracksData="userRecommendSongsList"></TrackList>
    </div>
</template>
<script lang="ts" setup >
import TrackList from "@/components/TrackList/TrackList.vue";
import { getUserRecommendSongsListAPI } from "@/api/user"
import { onBeforeMount, ref } from "vue"
// 每日推荐歌曲
const userRecommendSongsList = ref([]);
onBeforeMount(() => {
    getUserRecommendSongsList()
});
// 获取每日推荐歌曲
async function getUserRecommendSongsList() {
    const { data } = await getUserRecommendSongsListAPI()
    userRecommendSongsList.value = data.dailySongs
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