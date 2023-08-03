<template>
  <div class="search" v-show="show">
    <!-- 歌手区域 -->
    <div class="singer-content">
      <div class="title">
        <h1>艺人</h1>
        <a>查看更多</a>
      </div>
      <div class="singer-box">
        <div class="singer" v-for="(searchList, index) in searchLists.slice(0, 3)" :key="index">
          <img :src="searchList.img1v1Url + '?param=512y512'" alt="" loading="lazy" />
          <div class="singer-info">
            <p>歌手: {{ searchList.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="search-content">
      <!-- 单曲区域 -->
      <div class="single">
        <div class="title">
          <h1>单曲</h1>
          <a>查看更多</a>
        </div>
        <!-- 歌曲列表 -->
        <div class="track-list">
          <!-- 渲染歌曲区域 -->
          <div class="track-item" v-for="searchSingleList in searchSingleLists" :key="searchSingleList.id"
            @click="selectTrack(searchSingleList.id)">
            <!-- 封面 -->
            <div class="play track-play">
              <button>
                <svg-icon icon-class="play"></svg-icon>
              </button>
              <img :src="searchSingleList.album.artist.img1v1Url + '?param=512y512'" class="lazy-img animated-bg"
                loading="lazy" />
            </div>
            <!-- 歌曲信息 -->
            <div class="track-info">
              <h3 class="song-name">{{ searchSingleList.name }}</h3>
              <span>{{ searchSingleList.artists[0].name }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 专辑区域 -->
      <div class="album">
        <div class="title">
          <h1>专辑</h1>
          <a>查看更多</a>
        </div>
        <div class="album-list">
          <div class="album-item" v-for="(searchAlbumList, index) in searchAlbumLists" :key="searchAlbumList.id"
            @click="goToAlbum(searchAlbumList.id)">
            <!-- 专辑封面 -->
            <div class="play">
              <button>
                <svg-icon icon-class="play"></svg-icon>
              </button>
              <img :src="searchAlbumList.blurPicUrl + '?param=256y256'" class="lazy-img animated-bg" loading='lazy' />
            </div>
            <!-- 专辑信息 -->
            <div class="album-info">
              <h3>{{ searchAlbumList.name }}</h3>
              <!-- <p>{{ searchAlbumList.id }}</p> -->
              <p>{{ searchAlbumList.artist.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NProgress from 'nprogress';
export default {
  name: "Search",
  data() {
    return {
      show: false,
      searchLists: "",
      searchSingleLists: "",
      searchAlbumLists: "",
    };
  },
  created() {
    // 监听事件、数据接收 $on('发送过来的自定义事件',函数)
    this.$bus.$on("searchInfo", (res) => {
      this.searchLists = res;
      // console.log('歌手', this.searchLists);
    });
    this.$bus.$on("searchSingle", (res) => {
      // console.log(res);
      this.searchSingleLists = res;
    });
    this.$bus.$on("searchAlbum", (res) => {
      console.log(res);
      this.searchAlbumLists = res;
    });
    setTimeout(() => {
      if (!this.show) NProgress.start()
    }, 300);
  },
  // 在组件销毁前,清除事件监听
  beforeDestroy() {
    this.$bus.$off();
  },
  mounted() {
    NProgress.done()
    this.show = true
  },
  methods: {
    // 路由跳转
    goToAlbum(albumId) {
      // 带查询参数，结果是 /album?id=albumId
      // 提供了 path，params 会被忽略
      this.$router.push({
        path: "/album",
        query: {
          id: albumId
        }
      })
    },
    // 列表播放
    selectTrack(value) {
      // this.$store.dispatch('MusicId', value)
    }
  }
};
</script>
<style lang="scss" scoped>
// 标题文本
.title {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & h1 {
    color: #333;
    font-weight: 500;
  }

  & a {
    color: #b4b4b4;
  }
}

.search {
  width: 1180px;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 0 80px;

  & .singer-content {
    width: 100%;
    height: 100%;
    padding-bottom: 50px;

    & .singer-box {
      height: 300px;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 5px;

      & .singer {
        width: 100%;
        box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.01);
        border-radius: 10px;
        text-align: center;

        margin-right: 20px & h1 {
          padding: 40px 0;
        }

        & img {
          width: 120px;
          border-radius: 50%;
          // margin-right: 10px;
        }

        & .singer-info {
          margin-top: 10px;
        }
      }
    }

  }



  & .search-content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    & h1 {
      padding: 40px 0;
    }

    & .single {
      flex: 1 1 auto;
      margin-right: 10px;
    }

    & .album {
      flex: 1 1 auto;
      margin-left: 10px;
    }
  }

  // track-list 部分
  & .track-list {
    //   width: 50%;
    // flex: 1 1 auto;
    // height: 100%;
    padding-bottom: 5rem;
    margin: auto;
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 20px;

    & .track-item {
      display: flex;
      // flex: 1 1 auto;
      //   background-color: #fff;
      box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.01);

      & .track-play {
        width: 80px;

        & button {
          cursor: pointer;
        }

        & img {
          width: 80px;
          height: 80px;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }
      }



      & .track-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fff;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        padding: 1rem 2rem;

        & h3 {
          font-weight: 500;
        }

        & span {
          color: #707070;
        }
      }
    }
  }

  // album-list 部分
  & .album-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 20px;

    & .album-item {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      & .play {
        width: 170px;
        height: 170px;

        & button {
          cursor: pointer;
        }

        & img {
          width: 100%;
          height: 100%;
        }
      }

      & .album-info {
        text-align: center;

        & h3 {
          width: 170px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
          padding: 0.5rem 0em
        }

        & p {
          color: #7d7d7d;
          font-size: 14px;
        }
      }
    }
  }
}
</style>