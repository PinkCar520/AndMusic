<template>
  <div class="home" v-show="show">
    <div class="recommend">
      <h1>And You</h1>
      <!-- 每日推荐 -->
      <div class="recommend-content">
        <div class="recommend-left recommend-item-alike" @click="goToDaily()">
          <!-- 遮罩毛玻璃层 -->
          <img :src="userRecommendSongsCover + '?param=100y100'" alt="每日推荐" loading="lazy" />
          <!-- 播放图片展示层 -->
          <div class="mask-alike">
            <div class="play">
              <button @click.stop="handleRecommend()">
                <svg-icon icon-class="play"></svg-icon>
              </button>
              <img :src="userRecommendSongsCover + '?param=200y200'" alt="每日推荐" loading="lazy" />
            </div>
          </div>
          <div class="info">
            <p>{{ userRecommendSongsList.name }}</p>
            <p>{{ userRecommendSingerName }}</p>
          </div>
          <span>每日推荐</span>
        </div>
        <!-- 私人FM -->
        <div class="recommend-right recommend-item-alike">
          <!-- 遮罩毛玻璃层 -->
          <img :src="personalCover + '?param=100y100'" alt="私人FM" loading="lazy" />
          <!-- 播放图片展示层 -->
          <div class="mask-alike">
            <div class="play">
              <button @click.stop="handlePersonalFm()">
                <svg-icon icon-class="play"></svg-icon>
              </button>
              <img :src="personalCover + '?param=200y200'" alt="私人FM" loading="lazy" />
            </div>
          </div>
          <div class="info">
            <p>{{ personalsFmList.name }}</p>
            <p>{{ singerName }}</p>
          </div>
          <span>私人FM</span>
        </div>
      </div>
    </div>

    <!-- 排行榜 start -->
    <div class="billboard">
      <div class="billboard-title">
        <!-- 排行榜标题 -->
        <h1>排行榜</h1>
        <a @click="goToAllBillboard(categoryBillboard)">查看更多</a>
      </div>
      <div class="billboard-list">
        <div class="billboard-item" v-for="(topList, index) in topLists.items" :key="index"
          @click="goToRanking(topList.id)">
          <div class="play">
            <button @click.stop="play(topList.id)">
              <svg-icon icon-class="play"></svg-icon>
            </button>
            <img :src="topList.coverImgUrl" alt="推荐榜单" loading="lazy" />
            <span>{{ topList.updateFrequency }}</span>
          </div>
          <div class="billboard-info">
            <!-- 排行榜信息 -->
            <h3>{{ topList.name }}</h3>
            <!-- <h5 class="item-id">{{ topList.id }}</h5> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 排行榜 end -->

    <!-- 新碟上架 start-->
    <div class="disc">
      <div class="disc-title">
        <h1>新碟上架</h1>
        <a @click="goToAllDisc(categoryDisc)">查看更多</a>
      </div>
      <div class="disc-list">
        <div class="disc-item" v-for="album in albumList" :key="album.id" @click="goToDisc(album.id)">
          <div class="play">
            <button @click.stop="play(album.id)">
              <svg-icon icon-class="play"></svg-icon>
            </button>
            <img :src="album.picUrl" loading="lazy" />
          </div>
          <div class="disc-info">
            <h3>{{ album.name }}</h3>
            <!-- <h5 class="item-id">{{ album.artists[0].id }}</h5> -->
            <p>{{ album.artists[0].name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 新碟上架 end -->

    <!-- 推荐歌单 start-->
    <div class="recommend-playlist">
      <div class="recommend-playlist-title">
        <h1>推荐歌单</h1>
        <a @click="goToAllRecommend(categoryRecommend)">查看更多</a>
      </div>
      <div class="recommend-playlist-list">
        <div class="recommend-playlist-item" v-for="(recommendItem, index) in recommendPlaylist" :key="index"
          @click="goToRecommend(recommendItem.id)">
          <div class="play">
            <button>
              <svg-icon icon-class="play"></svg-icon>
            </button>
            <img :src="recommendItem.picUrl" loading="lazy" />
          </div>
          <div class="recommend-playlist-info">
            <h4>{{ recommendItem.name }}</h4>
            <!-- <h5 class="item-id">{{ recommendItem.id }}</h5> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐歌单 end -->
  </div>
</template>

<script>
import {
  getNewAlbumAPI,
  getRecommendPlaylistAPI,
  getTopListAPI,
  getPlaylistDetailAPI,
} from "@/api/playlist";
import { getUserRecommendSongsListAPI, getPersonalFmAPI } from "@/api/user"
import SvgIcon from "../components/SvgIcon.vue";
import NProgress from "nprogress";
export default {
  name: "Home",
  components: { SvgIcon },
  data() {
    return {
      show: false,
      // 新碟上架数据列表
      albumList: [],
      // 推荐歌单数据数据列表
      recommendPlaylist: [],
      // 过滤后的榜单数据列表
      topLists: {
        items: [],
        ids: [19723756, 180106, 60198, 3812895, 60131],
      },
      // 默认图片
      // 私人fm数据列表
      personalsFmList: [],
      // 私人fm歌手名字
      singerName: null,
      // 私人fm歌曲Id
      personalId: null,
      // 私人fm歌曲Id
      personalCover: 'http://p1.music.126.net/fL9ORyu0e777lppGU3D89A==/109951167206009876.jpg',
      // 每日推荐歌曲数据列表
      userRecommendSongsList: [],
      // 每日推荐歌曲封面
      userRecommendSongsCover: 'http://p1.music.126.net/fL9ORyu0e777lppGU3D89A==/109951167206009876.jpg',
      userRecommendSingerName: null,
      // 随机歌曲
      randomId: '',
      categoryBillboard: "排行榜",
      categoryDisc: "新碟上架",
      categoryRecommend: "推荐歌单",
    };
  },
  created() {
    // 实例创建完毕、函数自执行
    this.initData();
    this.getUserRecommendSongsList()
    this.getPersonalFm()
    // 页面加载进度条
    NProgress.start();
    setTimeout(() => {
      this.show = !this.show
    }, 400);
  },
  methods: {
    // 获取每日推荐歌曲
    async getUserRecommendSongsList() {
      const { data: res } = await getUserRecommendSongsListAPI()
      this.randomId = Math.round(Math.random() * 30)
      this.userRecommendSongsList = res.data.dailySongs[this.randomId]
      this.userRecommendSongsCover = res.data.dailySongs[this.randomId].al.picUrl
      this.userRecommendSingerName = res.data.dailySongs[this.randomId].ar[0].name
      // console.log('用户每日推荐歌曲-->', this.userRecommendSongsList);
    },
    // 获取私人FM歌曲
    async getPersonalFm() {
      const { data: res } = await getPersonalFmAPI()
      this.personalsFmList = res.data[0].album
      this.personalCover = res.data[0].album.blurPicUrl
      this.personalId = res.data[0].id
      this.singerName = this.personalsFmList.artists[0].name
      // console.log('用户私人FM歌曲-->', this.personalId );
    },
    handlePersonalFm() {
      this.getPersonalFm()
      this.$store.dispatch("MusicId", this.personalId)
    },
    handleRecommend() {
      this.getUserRecommendSongsList()
      this.$store.dispatch("MusicId", this.userRecommendSongsList.id)
    },
    initData() {
      // 获取所有榜单
      getTopListAPI()
        .then((res) => {
          this.topLists.items = res.data.list.filter((last) =>
            this.topLists.ids.includes(last.id)
          );
          // console.log("过滤后的所有榜单数据-->", this.topLists.items);
        })
      // 获取新碟上架数据
      getNewAlbumAPI(10)
        .then((res) => {
          this.albumList = res.data.albums;
          // console.log("新碟上架返回数据-->", this.albumList);
        })
      // 获取推荐歌单数据
      getRecommendPlaylistAPI(10)
        .then((res) => {
          this.recommendPlaylist = res.data.result;
          NProgress.done()
          // console.log("推荐歌单返回数据-->", this.recommendPlaylist);
        })

    },

    // 封面歌曲
    async play(value) {
      const { data: res } = await getPlaylistDetailAPI(value)
      let CoverSongId = null;
      // 歌曲数据列表
      CoverSongId = res.playlist.tracks[0].id;
      console.log(CoverSongId);
      this.$store.dispatch("MusicId", CoverSongId);
    },

    // 跳转每日推荐页面
    goToDaily() {
      this.$router.push("/daily/music");
    },
    // 跳转榜单详情页面
    goToRanking(value) {
      this.$router.push({
        name: "playlist",
        params: { id: value },
      });
    },
    // 跳转新碟上架页面
    goToDisc(value) {
      this.$router.push({
        name: "album",
        params: { id: value },
      });
    },
    // 跳转推荐歌单详情页面
    goToRecommend(value) {
      this.$router.push({
        name: "playlist",
        params: { id: value },
      });
    },

    // 跳转发现-所有榜单页面
    goToAllBillboard(categoryBillboard) {
      this.$router.push({
        name: "discover",
        query: {
          cat: categoryBillboard,
        },
      });
    },
    // 跳转发现-所有新碟上架页面
    goToAllDisc(categoryDisc) {
      this.$router.push({
        name: "discover",
        query: {
          cat: categoryDisc,
        },
      });
    },
    goToAllRecommend(categoryRecommend) {
      this.$router.push({
        name: "discover",
        query: {
          cat: categoryRecommend,
        },
      });
    },

  },
};
</script>
<style lang="scss" scoped>
// 公用样式
a {
  text-decoration: none;
  cursor: pointer;
}

// 定义 recomment-img 混入
@mixin recommend-img {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}

// 定义
@mixin title {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item-id {
  color: #ff7534;
}

.home {
  // 留白设计居中
  width: 1180px;
  height: 100%;
  margin: 0 auto;
  padding-bottom: 100px;

  & .recommend {
    // 推荐部分
    width: 100%;
    height: 100%;
    // margin: 4rem 0;
    // padding-top: 50px;

    & h1 {
      height: 80px;
      line-height: 80px;
    }

    & .recommend-content {
      // 主要内容
      width: 100%;
      display: grid; // grid网格布局
      grid-template-columns: repeat(2, 1fr); // 横向排列 2个box
      grid-gap: 24px; // 网格线之间的间隙宽度

      & .recommend-left {
        cursor: pointer;
      }

      & .recommend-item-alike {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: row;
        background-color: #fff;
        border-radius: 10px;

        & h1 {
          color: #444;
        }

        & img {
          @include recommend-img;
        }

        & .mask-alike {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;

          & .play {
            width: 200px;
            height: 220px;

            & button {
              cursor: pointer;
            }

            & img {
              width: 200px;
            }
          }
        }

        & .info {
          position: absolute;
          left: 40%;
          top: 20%;

          & p {
            padding: 10px 0;
            font-size: 16px;
            color: #e1e1e1;
          }

          & p:nth-child(1) {
            font-weight: bold;
            font-size: 25px;
            color: #fff;
          }

        }

        & span {
          position: absolute;
          bottom: 0;
          right: 0;
          color: #fff;
          padding: 5px;
          background: rgb(236, 65, 65);
          border-top-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }

      & .recommend-item-alike::before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 10px;
        backdrop-filter: saturate(170%) blur(30px);
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  & .billboard {
    // 排行榜
    width: 100%;
    height: 100%;
    padding-top: 50px;

    & .billboard-title {
      // 排行榜标题
      @include title;

      & h1 {
        color: #333;
        font-weight: 500;
      }

      & a {
        color: #b4b4b4;
      }
    }

    & .billboard-list {
      // 排行榜列表
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 1fr;
      grid-column-gap: 20px;
      grid-row-gap: 40px;

      & .billboard-item {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

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

        & .billboard-info {
          // 排行榜info
          text-align: center;

          & h3 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
            padding: 0.8rem 0em;
          }

          & p {
            color: #7d7d7d;
          }
        }
      }
    }
  }

  & .disc {
    // 新碟上架
    width: 100%;
    height: 100%;
    padding-top: 50px;

    & .disc-title {
      @include title;

      & h1 {
        color: #333;
        font-weight: 500;
      }

      & a {
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

        & .disc-info {
          // 排行榜info
          width: 220px;
          text-align: center;

          & h3 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
            padding: 0.8rem 0em;
          }

          & p {
            color: #7d7d7d;
          }
        }
      }
    }
  }

  & .recommend-playlist {
    // 推荐歌单
    width: 100%;
    height: 100%;
    padding-top: 50px;

    & .recommend-playlist-title {
      @include title;

      & h1 {
        color: #333;
        font-weight: 500;
      }

      & a {
        color: #b4b4b4;
      }
    }

    & .recommend-playlist-list {
      // 排行榜列表
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 40px 20px;

      & .recommend-playlist-item {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        & .recommend-playlist-info {

          // 排行榜info
          & h4 {
            padding: 0.8rem 0;
          }
        }
      }
    }
  }
}

.el-card {
  height: 200px;
  border: none;
  background-color: transparent;
}
</style>
