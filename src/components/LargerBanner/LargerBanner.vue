<template>
    <div class="disc">
        <div class="disc-title">
            <h1>新碟上架</h1>
            <a @click="goToAllDisc(categoryDisc)">查看更多</a>
        </div>
        <div class="disc-list">
            <div class="disc-item" v-for="item in BannerData" :key="item.id" @click="goToDisc(item.id)">
                <div class="play">
                    <button @click.stop="play(item.id)">
                        <svg-icon icon-class="play"></svg-icon>
                    </button>
                    <img :src="item.picUrl" loading="lazy" />
                </div>
                <div class="disc-info">
                    <h3>{{ item.name }}</h3>
                    <p>{{ item.artists[0].name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "LargerBanner",
    props: {
        BannerData: {
            type: Array,
            required: true
        }
    },
    methods: {
        // 跳转发现-所有新碟上架页面
        goToAllDisc(categoryDisc) {
            this.$router.push({
                name: "discover",
                query: {
                    cat: categoryDisc,
                },
            });
        },
        discHandle(id) {
            this.$emit("discHandle", id)
        },
        // 跳转新碟上架页面
        goToDisc(value) {
            this.$router.push({
                name: "album",
                params: { id: value },
            });
        },
    }
}
</script>
<style lang="scss" scoped>
// 定义
@mixin title {
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.disc {
    // 新碟上架
    width: 100%;
    height: 100%;
    padding-top: 50px;

    & .disc-title {
        @include title;

        & h1 {
            font-size: 35px;
            color: #333;
            font-weight: 550;
        }

        & a {
            font-size: 18px;
            color: #b4b4b4;
        }
    }

    & .disc-list {
        // 排行榜列表
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 40px 20px;

        & .disc-item {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;

            &.play {
                height: 220px;
            }

            & .disc-info {
                // 排行榜info
                width: 220px;
                text-align: center;

                & h3,
                & p {
                    font-size: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-weight: 500;
                    padding: 12px 0;
                }

                & p {
                    font-size: 14px;
                    color: #7d7d7d;
                }
            }
        }
    }
}
</style>