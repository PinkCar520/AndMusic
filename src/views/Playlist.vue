<template>
  <div class="playlist" v-show="show">
    <!-- 渲染banner -->
    <div class="banner">
      <div class="banner-logo">
        <div class="play">
          <button @click="selectTrack(tracksList[0].id)">
            <svg-icon icon-class="play"></svg-icon>
          </button>
          <img :src="detailList.coverImgUrl" loading="lazy" />
        </div>
      </div>
      <!-- 排行榜信息 -->
      <div class="banner-info">
        <h2>{{ detailList.name }}</h2>
        <!-- 图标-link-更新时间 -->
        <div class="banner-brief">
          <div class="avatar">
            <img :src="avatarUrl" loading="lazy" />
            <a href="https://music.163.com/#/user/home?id=1">网易云音乐</a>
            <span class="update-time">最近更新：{{ detailList.updateTime | showDate }}</span>
          </div>
          <div class="description">
            <p>歌单详情:</p>
            <div class="info">{{ detailList.description }}</div>
          </div>
          <!-- 按钮交互逻辑放在最后,便于点击 -->
          <div class="buttons">
            <button class="btn-active" @click="selectTrack(tracksList[0].id)">
              <svg-icon icon-class="play"></svg-icon>
            </button>
            <button>
              <svg-icon icon-class="collect"></svg-icon>
            </button>
            <button>
              <svg-icon icon-class="gambit"></svg-icon>
            </button>
          </div>
        </div>
      </div>
      <!-- 切换榜单的交互 切换榜单方案暂时废弃-->
      <!-- <div class="banner-list">
        <button class="choice-list soaring-chart">
          <img
            src="https://p1.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg"
            alt=""
          />
        </button>
      </div> -->
    </div>

    <!-- 歌曲列表 -->
    <div class="track-list">
      <!-- 渲染歌曲区域 -->
      <div class="track-item" v-for="track in tracksList" :key="track.id" @click="selectTrack(track.id)">
        <!-- :class="{ copy: track.copyright == isCopyright }" -->
        <div class="play track-play" title="">
          <!-- :class="{ copy: track.copyright == isCopyright, disabled: track.copyright == isCopyright }" -->
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
</template>
<script>
import SvgIcon from "@/components/SvgIcon.vue";
import { getPlaylistDetailAPI, } from "@/api/playlist";
import { formatDate } from "../utils/common";
import NProgress from "nprogress";
// import { getCheckMusicAPI } from "@/api/song";
export default {
  name: "Playlist",
  components: {
    SvgIcon,
  },
  data() {
    return {
      show: false,
      // 详情数据列表
      detailList: [],
      // 头像
      avatarUrl: "",
      // 歌曲数据列表
      tracksList: [],
      playlist: [], // 播放列表
      // musicId: '' // 音乐Id
      // 版权信息检验 1 = VIP付费音乐
      isCopyright: true,
      // 版权提示
      hit: 'VIPOnly'
    };
  },

  created() {
    // this.getCheckMusic()
    this.getPlaylistDetail()
    setTimeout(() => {
      if (!this.show) NProgress.start();
    }, 100);
  },
  methods: {
    // 获取歌单详情
    async getPlaylistDetail() {
      const { data: res } = await getPlaylistDetailAPI(this.$route.params.id)
      // 榜单详情数据列表
      this.detailList = res.playlist;
      // 歌曲数据列表
      this.tracksList = res.playlist.tracks;
      this.avatarUrl = this.detailList.creator.avatarUrl;
      NProgress.done();
      // 创建新歌曲id列表
      let str = ''
      this.tracksList.forEach((e) => {
        str += e.id + ',';
      });
      str = str.substring(0, str.length - 1);
      this.playlist = str.split(',')
      // console.log(this.playlist);
      // 传音乐列表数组给vuex
      this.$store.dispatch("MusicPlaylist", this.playlist);
      this.show = true
    },
    // 列表播放
    selectTrack(value) {
      this.$bus.$emit("songValue", value);
    },
  },
  computed: {
  },
  filters: {
    showDate(value) {
      return formatDate(value);
    },
  },
};
</script>
<style lang="scss" scoped>
.track-play {
  width: 80px;

  & button {
    cursor: pointer;
  }

  & img {
    width: 100%;
  }
}

.el-card {
  // 解决骨架屏异常样式
  height: 290px;
  border: none;
  background-color: transparent;
  overflow: none;
}

.el-alert--warning.is-light {
  position: absolute;
  left: 50%;
  top: 14%;
  transform: translate(-50%, -50%);
  height: 50px;
  width: 300px;
}

.playlist {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding-bottom: 80px;

  // banner 部分
  & .banner {
    width: 1180px;
    padding: 4rem 0;
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
      height: 290px;
      padding: 0.5rem 2rem;
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
        padding: 10px 0;
      }

      & .banner-brief {

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
            padding: 0.2rem 0rem;
            text-decoration: none;
          }

          & span {
            color: #444;
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
            margin-right: 0.5rem;
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
      padding: 2rem 1rem;
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

  // track-list 部分
  & .track-list {
    width: 1180px;
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

// 音乐版权检验
.copy {
  color: #b1b1b1;
  cursor: no-drop;

  & img {
    filter: opacity(0.3);
  }
}
</style>