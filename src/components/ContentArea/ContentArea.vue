<template>
    <div class="discover-right">
        <div class="discover-content">
            <div class="discover-content-info">
                <div class="discover-list" v-for="(playlist, index) in discoverData.playlists" :key="index">
                    <div class="discover-item">
                        <div class="play" @click="goPlayList(index, playlist.id)">
                            <img :src="discoverData.isImgUrl ? playlist.coverImgUrl : playlist.picUrl" alt=""
                                loading="lazy" />
                            <span v-show="discoverData.isCountShow || discoverData.isTopListShow">{{
                                discoverData.isCountShow ?
                                showCount(playlist.playCount) :
                                playlist.updateFrequency
                            }}</span>
                        </div>
                        <div class="discover-info">
                            <h4>{{ playlist.name }}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { viewCounts } from "../../utils/common";
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DiscoverComponentData } from '@/api/playlist';
const locale = ref(zhCN)
const router = useRouter()

const props = defineProps({
    discoverData: {
        type: Object as () => DiscoverComponentData,
        default: [],
        required: true
    },
})
function goPlayList(index: number, id: number) {
    let catRule = props.discoverData.catTag === '新碟上架'
    router.push({
        name: catRule ? "album" : "playlist",
        params: { songListId: id },
    });
};
// 播放量
function showCount(value: number) {
    return viewCounts(value);
};
</script>
<style lang="scss" scoped>
.discover-right {
    display: flex;
    flex-direction: column;
}

.discover-content {
    display: flex;
    flex-direction: column;
    padding-left: 25px;

    & .discover-content-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;

        & .button {
            display: flex;
            align-items: center;
            width: max-content;
            height: 40px;
            padding: 10px 20px;
            margin-right: 10px;
            font-weight: 550;
            // color: #555;
            color: #bbbbbb;
            border-radius: 5px;
            text-align: center;
        }
    }

    & .discover-content-info {
        // 排行榜列表
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 20px;
        grid-row-gap: 25px;

        & .discover-list {
            & .discover-item {
                width: 190px;

                & span {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    padding: 5px 10px;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 12px;
                    backdrop-filter: saturate(180%) blur(20px);
                    background-color: rgba(255, 255, 255, 0.2);
                }

                // 排行榜item
                & img {
                    width: 190px;
                    height: 200px;
                    border-radius: 10px;
                }

                & .discover-info {

                    // 排行榜info
                    //   text-align: center;
                    & h4 {
                        width: 100%;
                        white-space: wrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-weight: 550;
                        padding: 12px 0;
                        font-size: 16px;
                        color: rgb(66, 69, 78);
                    }

                    & h5 {
                        text-align: center;
                        color: #ff7534;
                    }

                    & p {
                        padding: 5px 0;
                        color: #7d7d7d;
                    }
                }
            }
        }
    }
}
</style>