<template>
    <div class="track-list">
        <div class="track-item" v-for="track in tracksData" :key="track.id" @click="selectTrack(track.id)">
            <div class="play track-play" title="">
                <button>
                    <SvgIcon name="play"></SvgIcon>
                </button>
                <img :src="track.al.picUrl + '?param=112y112'" class="lazy-img animated-bg" loading="lazy" />
            </div>
            <div class="track-info">
                <h3 class="song-name">{{ track.name }}</h3>
                <p>{{ track.ar[0].name }}</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useBaseStore } from "@/stores/user"
import { Songs } from "@/api/playlist";
defineProps({
    tracksData: {
        type: Array as () => Songs[],
        default: [],
        required: true
    },
})

const store = useBaseStore()
function selectTrack(trackId: number) {
    store.$patch((state) => {
        state.songId = trackId
    });
}
</script>
<style lang="scss" scoped>
.track-list {
    width: 1180px;
    height: 100%;
    padding-bottom: 80px;
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

        .track-play {
            width: 80px;

            & button {
                cursor: pointer;
            }

            & img {
                width: 100%;
            }
        }

        & .track-info {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            padding: 0px 32px;

            & h3 {
                width: 120px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 500;
                margin: 4.8px 0em;
                font-size: 16px;
            }

            & p {
                color: #707070;
                padding: 5px 0;
                font-size: 13px;
            }
        }
    }
}
</style>@/stores/index