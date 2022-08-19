<template>
    <div class="track-list">
        <div class="track-item" v-for="track in tracksData" :key="track.id" @click="selectTrack(track.id)">
            <div class="play track-play" title="">
                <button>
                    <svg-icon icon-class="play"></svg-icon>
                </button>
                <img :src="track.al.picUrl + '?param=112y112'" class="lazy-img animated-bg" loading="lazy" />
            </div>
            <div class="track-info">
                <h3 class="song-name">{{ track.al.name }}</h3>
                <p>{{ track.ar[0].name }}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "trackList",
    props: {
        tracksData: {
            type: Array,
            require: true
        }
    },
    methods: {
        selectTrack(trackId) {
            this.$store.dispatch('MusicId', trackId)
        }
    },
    computed: {
    }
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
</style>