<template>
  <div class="playlist">
    <!-- 渲染banner -->
    <div class="banner">
      <div class="banner-logo">
        <div class="play">
          <button>
            <svg-icon icon-class="play"></svg-icon>
          </button>
          <img :src="albumLists.blurPicUrl" loading="lazy" />
        </div>
      </div>
      <!-- 排行榜信息 -->
      <div class="banner-info">
        <h2>{{ albumLists.name }}</h2>
        <!-- 图标-link-更新时间 -->
        <div class="banner-brief">
          <div class="avatar">
            <img :src="artist.picUrl + '?param=1024y1024'" loading="lazy" />
            <a href="https://music.163.com/#/user/home?id=1">{{
                artist.name
            }}</a>
            <span class="update-time">发行时间: {{ albumLists.publishTime | showDate }}</span>
          </div>
          <div class="description">
            <p>发行公司: {{ albumLists.company }}</p>
            <!-- <p>专辑类别: {{ albumLists.subType }}</p> -->
            <div class="info">{{ albumLists.description }}</div>
          </div>
          <!-- 按钮交互逻辑放在最后,便于点击 -->
          <div class="buttons">
            <button class="btn-active">
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
    </div>
    <!-- 歌曲列表 -->
    <div class="track-list">
      <!-- 渲染歌曲区域 -->
      <div class="track-item" v-for="(albumSong, index) in albumSongs" :key="index" @click="submit(index)">
        <img :src="albumLists.blurPicUrl" data-real="?param=224y224" class="lazy-img animated-bg" loading="lazy" />
        <div class="track-info">
          <p class="song-name">{{ albumSong.name }}</p>
          <span>{{ artist.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SvgIcon from "../components/SvgIcon.vue";
import { getAlbumListAPI } from "@/api/playlist";
import { formatDate } from "../utils/common";
export default {
  name: "Album",
  components: { SvgIcon },
  created() {
    window.Vue = this;
  },
  data() {
    return {
      // album.name WoLaLa 专辑名字
      // album.company 发行公司
      // album.subType 专辑类别
      // album.blurPicUrl 专辑图片
      // album.description: "人生要多少完美 才叫足够"
      // album.artist.name 苏玮 歌手名字
      // album.artist.picUrl 歌手图片
      albumLists: "",
      albumSongs: "",
      artist: "",
      name: "",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // console.log(this.$route.params.id);
      getAlbumListAPI(this.$route.params.id).then((res) => {
        // console.log(res);
        this.albumLists = res.data.album;
        this.artist = this.albumLists.artist;
        this.albumSongs = res.data.songs;
      });
    },
    submit(index) {
      this.$bus.$emit("songValue", this.albumSongs[index].id);
    },
  },
  filters: {
    showDate(value) {
      return formatDate(value);
    },
  },
};
</script>
<style lang="scss" scoped>
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
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.01);

      & img {
        width: 290px;
        height: 100%;
        border-radius: 10px;
        box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.05);
      }
    }

    & .banner-info {
      // 榜单信息
      width: 420px;
      box-sizing: border-box;
      height: 290px;
      padding: 1rem 2rem;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;

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
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        // 图标-link-更新时间
        & .avatar {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          & img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }

          & a {
            color: #3360f5;
            padding: 0.2rem 0rem;
            text-decoration: none;
          }

          & span {
            color: #444;
          }
        }

        & .description {

          & p {
            color: #444;
            padding: 5px 0;
          }

          & .info {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-size: 14px;
            opacity: 0.68;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            cursor: pointer;
            white-space: pre-line;
          }
        }

        & .buttons {
          width: 100%;
          height: 40px;

          & button {
            width: 100px;
            height: 40px;
            border-radius: 20px;
            border: none;
            margin-right: 0.5rem;
            color: #fff;

            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.01);
          }

          & .btn-active {
            background-color: rgb(253, 67, 67);
          }
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

    & .track-item {
      display: flex;
      flex: 1 1 auto;
      //   background-color: #fff;
      box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.01);
      cursor: pointer;

      & img {
        height: 80px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      }

      & .track-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        background-color: #fff;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        padding: 0 2rem;

        & span {
          color: #707070;
          padding: 5px 0;
          font-size: 13px;
        }
      }
    }
  }
}
</style>