<template>
    <div class="user" v-show="userShow">
        <div class="top">
            <div class="user-top-left">
                <!-- 展示用户信息 -->
                <div class="user-info">
                    <img :src="userDetailList.backgroundUrl + '?param=600y400'" alt="" class="backdrop" loading="lazy">
                    <div class="primary">
                        <img :src="userDetailList.avatarUrl" alt="" class="avatar" loading="lazy">
                        <p>{{ userDetailList.nickname }}</p>
                    </div>
                    <div class="other">
                        <span>关注: {{ userDetailList.follows }}</span>
                        <span>粉丝: {{ userDetailList.followeds }}</span>
                        <span>lv.{{ level }}</span>
                    </div>
                </div>
                <!-- 展示用户喜欢的音乐 -->
                <div class="user-like">
                    <div class="like-item">
                        <span>我喜欢的音乐</span>
                        <span class="count">{{ userLikeList.length }}首歌</span>
                    </div>
                    <div class="user-like-play">
                        <button @click="likePlay()">
                            <svg-icon icon-class="play"></svg-icon>
                        </button>
                    </div>
                </div>
            </div>
            <!-- 每日推荐 -->
            <div class="daily-recommend">
                <div class="daily-recommend-item" v-for="item in userRecommendList" :key="item.id"
                    @click="selectTrack(item.id)">
                    <div class="daily-recommend-play">
                        <button>
                            <svg-icon icon-class="play"></svg-icon>
                        </button>
                        <img :src="item.al.picUrl + '?param=112y112'" class="lazy-img animated-bg" loading="lazy" />
                    </div>
                    <div class="daily-recommend-info">
                        <h3 class="song-name">{{ item.al.name }}</h3>
                        <span>{{ item.ar[0].name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 展示歌单信息 -->
        <div class="bottom">
            <!-- tabs标签页 -->
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="全部" name="playlist" id="ah">
                    <!-- 歌单详情 -->
                    <div class="common-list">
                        <div class="common-item" v-for="(item, index) in userPlaylist.slice(1)" :key="item.id"
                            @click="goToPlaylist(item.id)">
                            <div class="play">
                                <button>
                                    <svg-icon icon-class="play"></svg-icon>
                                </button>
                                <img :src="item.coverImgUrl" alt="" loading="lazy">
                            </div>
                            <h3>{{ item.name }}</h3>
                            <p>{{ userDetailList.nickname }}</p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="second">
                    <!-- 专辑详情 -->
                    <div class="common-list">
                        <div class="common-item" v-for="(item, index) in userAlbumList" :key="item.id"
                            @click="goToPlaylist(item.id)">
                            <div class="play">
                                <button>
                                    <svg-icon icon-class="play"></svg-icon>
                                </button>
                                <img :src="item.picUrl" alt="" loading="lazy">
                            </div>
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.artists[0].name }}</p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="艺人" name="third">
                    <!-- 歌手详情 -->
                    <div class="common-list">
                        <div class="common-item" v-for="(item, index) in userArtistList" :key="item.id"
                            @click="goToPlaylist(item.id)">
                            <div class="play">
                                <button>
                                    <svg-icon icon-class="play"></svg-icon>
                                </button>
                                <img :src="item.picUrl" alt="" loading="lazy">
                            </div>
                            <h3>{{ item.name }}</h3>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="最近播放" name="four">
                    <!-- 最近播放歌曲 -->
                    <div class="user-recent-music">
                        <!-- 渲染歌曲区域 -->
                        <!-- <div class="recent-item" v-for="item in userRecordList" :key="item.resourceId"
                            @click="selectTrack(item.resourceId)">
                            <div class="play recent-play">
                                <button>
                                    <svg-icon icon-class="play"></svg-icon>
                                </button>
                                <img :src="item.data.al.picUrl + '?param=112y112'" class="lazy-img animated-bg"
                                    loading="lazy" />
                            </div>
                            <div class="recent-info">
                                <h3 class="song-name">{{ item.data.al.name }}</h3>
                                <span>{{ item.data.ar[0].name }}</span>
                            </div>
                        </div> -->
                        <TrackList :tracksData="userRecordList"></TrackList>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import {
    getLoginStatusAPI,
    getUserDetailAPI,
    getUserAccountAPI,
    getUserSubcountAPI,
    getUserLikeListAPI,
    getUserPlaylistAPI,
    getUserAlbumListAPI,
    getUserArtistListAPI,
    getUserRecordListAPI,
    getUserRecommendSongsListAPI

} from "@/api/user.js";
import TrackList from "@/components/TrackList/TrackList.vue";
import NProgress from "nprogress";
import { mapActions } from "vuex";
export default {
    name: "User",
    components: {
        TrackList
    },
    data() {
        return {
            userShow: false,
            // 用户数据列表
            // userList: [],
            // 用户详情数据列表
            userDetailList: [],
            // userAccountList: [],
            // userSubcountList: [],
            // 用户喜欢数据列表
            userLikeList: [],
            // 用户歌单数据列表
            userPlaylist: [],
            // 用户歌单数据列表
            userAlbumList: [],
            // 用户歌手收藏列表
            userArtistList: [],
            // 用户听歌排行列表
            userRecordList: [],
            // 用户每日推荐列表
            userRecommendList: [],
            level: '',
            // coverImgUrl,
            // tabs默认显示
            activeName: 'playlist',
            playlist: []
        };
    },
    created() {
        // 调用方法初始化
        // this.getLoginStatus()
        this.getUserDetail()
        this.getUserLikeList()
        this.getUserPlaylist()
        this.getUserAlbumList()
        this.getUserArtistList()
        this.getUserRecordList()
        this.getUserRecommendList()
        // this.getUserAccount()
        // this.getUserSubcount()
        // NProgress
        setTimeout(() => {
            this.userShow = !this.userShow
        }, 300);
    },
    methods: {
        // // 获取登录状态和用户信息
        // async getLoginStatus() {
        //     const { data: res } = await getLoginStatusAPI()
        //     this.userList = res.data.profile
        //     console.log('用户信息-->',this.userList);
        // },
        // 获取用户详情数据列表
        async getUserLikeList() {
            const { data: res } = await getUserDetailAPI(126196613)
            this.userDetailList = res.profile
            this.level = res.level
            NProgress.start()
            // console.log('用户详情数据列表-->', this.userDetailList);
        },
        // 获取用户喜欢数据列表
        async getUserDetail() {
            const { data: res } = await getUserLikeListAPI(126196613)
            this.userLikeList = res.ids
            // console.log('用户喜欢数据列表-->', this.userLikeList);
        },
        // 获取用户歌单数据
        async getUserPlaylist() {
            const { data: res } = await getUserPlaylistAPI(126196613)
            this.userPlaylist = res.playlist

            // console.log('用户歌单数据列表-->', this.userPlaylist);
        },
        // 获取用户收藏专辑数据
        async getUserAlbumList() {
            const { data: res } = await getUserAlbumListAPI()
            this.userAlbumList = res.data

            // res.count > 0 ? this.userAlbumList = res : Message({
            //     message: '当前没有收藏的专辑',
            //     type: 'error',
            //     duration: 3 * 1000
            // })
            // console.log('用户收藏专辑数据-->', this.userAlbumList);
        },
        // 获取用户收藏歌手数据
        async getUserArtistList() {
            const { data: res } = await getUserArtistListAPI()
            this.userArtistList = res.data

            // res.count > 0 ? this.userAlbumList = res : Message({
            //     message: '当前没有收藏的专辑',
            //     type: 'error',
            //     duration: 3 * 1000
            // })
            // console.log('用户收藏歌手数据-->', this.userArtistList);
        },
        // 获取用户听歌排行数据
        async getUserRecordList() {
            const { data: res } = await getUserRecordListAPI()
            this.userRecordList = res.data.list.map((item) => {
                return item.data
            })
            // console.log('用户听歌排行数据-->', this.userRecordList);
        },
        // 获取用户每日推荐数据
        async getUserRecommendList() {
            const { data: res } = await getUserRecommendSongsListAPI()
            NProgress.done();
            this.userRecommendList = res.data.dailySongs
            // console.log('用户每日推荐数据-->', this.userRecommendList);
        },
        // // 获取账号信息
        // async getUserAccount() {
        //     const { data: res } = await getUserAccountAPI()
        //     console.log(res);
        //     this.userAccountList = res
        //     console.log('账号信息-->',this.userDetailList);
        // },
        // // 获取用户信息 , 歌单，收藏，mv, dj 数量
        // async getUserSubcount() {
        //     const { data: res } = await getUserSubcountAPI()
        //     console.log(res);
        //     this.userSubcountList = res
        //     console.log('获取用户信息 , 歌单,收藏，mv, dj 数量-->',this.userDetailList);
        // }
        // 跳转playlist页面
        goToPlaylist(value) {
            this.$router.push({
                name: "playlist",
                params: { id: value },
            });
        },
        // 列表播放
        // ...mapActions({ selectTrack: 'MusicId' }),
        selectTrack(value) {
            this.$store.dispatch('MusicId', value)
        },
        // 喜欢播放
        likePlay() {
            // 创建新歌曲id列表
            let str = ''
            this.userLikeList.forEach((e) => {
                str += e + ','
            });
            str = str.substring(0, str.length - 1)
            const playlist = str.split(',')
            // console.log(this.playlist);
            this.$store.dispatch("MusicPlaylist", this.playlist);
            this.$store.dispatch("MusicId", this.userLikeList[0])
        },
    },
}
</script>
<style lang="scss" scoped>
// 背景
.backdrop {
    width: 300px;
    height: 100%;
    // margin: 0 auto;
}

.user {
    width: 1180px;
    height: 100%;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    & .top {
        display: flex;

        & .user-top-left {

            flex: 1;

            // 用户信息
            & .user-info {
                width: 300px;
                height: 450px;
                background-color: #fff;
                box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
                // margin: 0 auto;
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-bottom: 40px;

                & img {
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                }

                // 头像,昵称
                & .primary {
                    width: 100%;
                    text-align: center;

                    & .avatar {

                        margin-top: 40px;
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                    }

                    & p {
                        font-size: 18px;
                        padding: 5px 0;
                    }
                }

                // 关注,等级
                & .other {
                    width: 100%;
                    font-size: 14px;
                    padding: 20px;
                    display: flex;
                    justify-content: space-evenly;

                    & span {
                        font-size: 14px;
                        // padding: 0 20px;
                        color: #a3a3a3;
                    }
                }

            }

            // 用户喜欢的音乐
            & .user-like {
                position: relative;
                width: 300px;
                height: 200px;
                background-image: linear-gradient(-225deg, #97a8cf 0%, #a2bfee 50%, #e7e7e7 100%);
                box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
                border-radius: 15px;
                padding: 0 20px;
                margin-top: 40px;
                display: flex;
                // flex-direction: column;
                align-items: center;
                justify-content: space-around;

                & .like-item {
                    display: flex;
                    flex-direction: column;

                    & span {
                        font-size: 20px;
                        color: #333;
                        font-weight: bold;
                    }

                    & .count {
                        font-size: 16px;
                        font-weight: normal;
                    }
                }

                & .user-like-play button {
                    border: none;
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    backdrop-filter: saturate(180%) blur(20px);
                    background-color: rgba(255, 255, 255, 0.1);
                    display: block;
                    cursor: pointer;
                    transition: all 0.2s ease-in;
                }

                & button:hover {
                    transform: scale(1.1);
                }
            }
        }

        // 每日推荐
        .daily-recommend {
            flex: 2.5;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 20px;
            cursor: pointer;

            & .daily-recommend-item {
                height: 60px;
                display: flex;

                & .daily-recommend-play {
                    position: relative;
                    width: 60px;
                    border: none;

                    & button {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border: none;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        backdrop-filter: saturate(180%) blur(20px);
                        background-color: rgba(255, 255, 255, 0.1);
                        display: none;
                        transition: all 0.2s ease-in-out;
                    }

                    & img {
                        width: 60px;
                        height: 60px;
                        border-top-left-radius: 6px;
                        border-bottom-left-radius: 6px;
                    }
                }

                & .daily-recommend-play:hover button {
                    display: block;
                }

                & .daily-recommend-play:hover img {
                    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.3);
                }

                & .daily-recommend-info {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;
                    background-color: #fff;
                    border-top-right-radius: 6px;
                    border-bottom-right-radius: 6px;
                    padding: 0px 8px;

                    & h3 {
                        width: 120px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-weight: 500;
                        margin: 4px 0;
                        font-size: 16px;
                    }

                    & span {
                        color: #7d7d7d;
                        font-size: 13px;
                    }
                }
            }
        }
    }

    & .bottom {
        margin-top: 40px;

        // 公共
        & .common-list {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-gap: 40px 0;

            & .common-item {
                width: 200px;
                height: 100%;

                & .play {
                    height: 200px;

                    // 封面
                    & img {
                        width: 100%;
                        height: 100%;
                        border-radius: 15px;
                    }

                }

                & h3 {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                    margin: 12px 0;
                }

                & p {
                    text-align: center;
                    color: #7d7d7d;
                }

            }
        }

        // 最近播放
        & .user-recent-music {
            width: 1180px;
            height: 100%;
            padding-bottom: 80px;
            margin: auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 20px;
            cursor: pointer;

            & .recent-item {
                height: 80px;
                display: flex;
                flex: 1 1 auto;
                background-color: #fff;
                box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.01);
                margin-bottom: 15px;
                border-radius: 10px;

                & img {
                    height: 80px;
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
                }

                & .recent-info {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0px 32px;

                    & h3 {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-weight: 500;
                        font-size: 18px;
                        margin: 4px 0em;
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


.recent-play {
    width: 80px;

    & button {
        cursor: pointer;
    }

    & img {
        width: 100%;
    }
}

::v-deep .el-tabs--card>.el-tabs__header {
    border: none;
    margin-bottom: 40px;

    .el-tabs__nav {
        border: none;

        .el-tabs__item {
            font-size: 20px;
            font-weight: 550;
            border-radius: 10px;
            border: none;
        }
    }
}

::v-deep .is-active {
    background-color: #fff;
}
</style>