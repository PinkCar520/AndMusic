<template>
  <div class="discover">
    <h1>发现</h1>
    <div class="main">
      <!-- 左侧边栏分类按钮 -->
      <div class="discover-buttons">
        <div class="button" v-for="(category, index) in categoryList" :key="index" @click="goToCat(category)">
          {{ category }}
        </div>
      </div>
      <!-- 右侧边栏主体内容 -->
      <div class="discover-content">
        <!-- <div class="discover-content-title">
          <div class="button">官方|</div>
          <div class="button">推荐</div>
        </div> -->
        <div class="discover-content-info">
          <div class="discover-list" v-for="(playlistCat, index) in playlistCats" :key="index">
            <div class="discover-item">
              <div class="play" @click="goPlayList(index)">
                <button>
                  <svg-icon icon-class="play"></svg-icon>
                </button>
                <img :src="isImgUrl ? playlistCat.coverImgUrl : playlistCat.picUrl" alt="" loading="lazy" />
                <span>{{ playlistCat.updateFrequency }}</span>
              </div>
              <div class="discover-info">
                <!-- 信息 -->
                <!-- <p>{{ isCountShow ? '' : playlistCat.playCount | showCount }}</p> -->
                <h4>{{ playlistCat.name }}</h4>
                <!-- <h5 class="item-id">{{ playlistCat.id }}</h5> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getPlaylistCatAPI,
  getTopListAPI,
  getRecommendPlaylistAPI,
  getNewAlbumAPI,
  getNewSongAPI,
} from "@/api/playlist";
import { viewCounts } from "../utils/common";
export default {
  name: "Discover",
  data() {
    return {
      playlistCats: [],
      categoryList: [
        "全部",
        "排行榜",
        "推荐歌单",
        // "数字专辑",
        "新碟上架",
        // "新歌速递",
        // "有声书",
      ],
      category: "",
      // 三元表达式,解决渲染图片的后台路径不一致
      // 另外一种方法,直接在获取数据时指定imgUrl
      isImgUrl: true,
      // 播放量展示
      isCountShow: false
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // 判断渲染
      // console.log(this.category);
      // 默认加载 全部歌单
      getPlaylistCatAPI().then((res) => {
        // console.log(res);
        this.playlistCats = res.data.playlists;
      });
    },
    goPlayList(index) {
      this.$router.push({
        name: "playlist",
        params: { id: this.playlistCats[index].id },
      });
    },
    goToCat(category) {
      // 根据category来判断请求
      // "全部",
      // "排行榜",
      // "歌单",
      // "数字专辑",
      // "新碟上架",
      // "新歌速递",
      // "有声书",
      switch (category) {
        case "全部":
          console.log("点击的是", category);
          // 获取全部歌单
          getPlaylistCatAPI().then((res) => {
            // console.log(res);
            this.playlistCats = res.data.playlists;
            this.isImgUrl = true;
          });
          break;
        case "排行榜":
          console.log("点击的是", category);
          // 获取排行榜
          getTopListAPI().then((res) => {
            // console.log(res);
            this.playlistCats = res.data.list;
            this.isImgUrl = true;
          });
          break;
        case "推荐歌单":
          // console.log("点击的是", category);
          // 获取推荐歌单数据
          getRecommendPlaylistAPI(100)
            .then((res) => {
              // console.log("推荐歌单返回数据-->", res);
              this.playlistCats = res.data.result;
              this.isImgUrl = false;
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        // case "数字专辑":
        //   console.log("点击的是", category);
        //   break;
        case "新碟上架":
          // console.log("点击的是", category);
          getNewAlbumAPI(100)
            .then((res) => {
              // console.log("新碟上架返回数据-->", res.data.albums);
              this.playlistCats = res.data.albums;
              // console.log("id------");
              this.isImgUrl = false;
              this.isCountShow = true
            })
            .catch((error) => {
              console.log(error);
            });
          break;
          // 存在渲染冲突问题
          // case "新歌速递":
          //   console.log("点击的是", category);
          //   getNewSongAPI(0).then((res) => {
          //     console.log("新歌速递返回数据-->", res);
          //     res.data.data.forEach(element => {
          //       this.playlistCats = element.album;
          //       console.log(this.playlistCats);
          //     });;
          //     this.imgUrl = false;
          //   });
          break;
        case "有声书":
          // console.log("点击的是", category);
          break;
        default:
          break;
      }
      // 路由query方式跳转
      this.$router
        .push({
          name: "discover",
          query: {
            cat: category,
          },
        })
        .catch((error) => {
          return;
        });
    },
  },
  filters: {
    // 播放量
    showCount(value) {
      return viewCounts(value);
    },
  },
};
</script>
<style lang="scss" scoped>
// 居中播放按钮 毛玻璃效果
.play {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  & button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    backdrop-filter: saturate(180%) blur(20px);
    background-color: rgba(255, 255, 255, 0.1);
    display: none;
    transition: all 0.2s ease-in-out;

    & svg {
      color: #fff;
    }
  }

  // 排行榜item
  & img {
    width: 217px;
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
  }
}

.play:hover button {
  display: block;
}

.play:hover img {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
}

.discover {
  width: 1180px;
  height: 100%;
  padding: 50px 0 100px;
  margin: auto;

  & h1 {
    height: 80px;
    line-height: 80px;
  }

  & .main {
    display: flex;
    flex-direction: row;

    & .discover-buttons {
      background: rgb(236, 236, 236);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;

      & .button {
        width: 120px;
        height: 40px;
        padding: 10px 20px;
        margin: 10px;
        font-weight: 550;
        // color: #555;
        color: rgb(51, 94, 234);
        background-color: rgb(250, 250, 250);
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
      }
    }

    & .discover-content {
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
                padding: 0.8rem 0em;
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
  }
}
</style>