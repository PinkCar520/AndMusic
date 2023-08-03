<template>
  <div class="home" v-show="isShow">
    <div class="recommend">
      <h1>And You</h1>
      <!-- 每日推荐 -->
      <div class="recommend-content">
        <div class="recommend-left recommend-item-alike" @click="goToDaily()">
          <!-- 遮罩毛玻璃层 -->
          <img :src="userRecommend_songsCover + '?param=100y100'" alt="每日推荐" loading="lazy" />
          <!-- 播放图片展示层 -->
          <div class="mask-alike">
            <div class="play">
              <button @click.stop="handleRecommend()">
                <SvgIcon name="play"></SvgIcon>
              </button>
              <img :src="userRecommend_songsCover + '?param=200y200'" alt="当前状态无法日推" loading="lazy" />
              <div class="reason">{{ userRecommend_reason }}</div>
            </div>
          </div>
          <div class="info">
            <p>{{ userRecommend_songName }}</p>
            <p>{{ userRecommend_singerName }}</p>
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
                <SvgIcon name="play"></SvgIcon>
              </button>
              <img :src="personalCover + '?param=200y200'" alt="私人FM" loading="lazy" />
              <div class="reason">{{ personalReason }}</div>
            </div>
          </div>
          <div class="info">
            <p>{{ songName }}</p>
            <p>{{ singerName }}</p>
          </div>
          <span>私人FM</span>
        </div>
      </div>
    </div>

    <!-- 排行榜 start -->
    <div class="billboard">
      <div class="billboard-title">
        <h1>排行榜</h1>
        <a @click="goToAllBillboard(categoryBillboard)">查看更多</a>
      </div>
      <div class="billboard-list">
        <div class="billboard-item" v-for="(topList, index) in topLists.items" :key="index"
          @click="goToRanking(topList.id)">
          <div class="play">
            <button @click.stop="play(topList.id)">
              <SvgIcon name="play"></SvgIcon>
            </button>
            <img :src="topList.coverImgUrl" alt="推荐榜单" loading="lazy" />
            <span>{{ topList.updateFrequency }}</span>
          </div>
          <div class="billboard-info">
            <h3>{{ topList.name }}</h3>
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
              <SvgIcon name="play"></SvgIcon>
            </button>
            <img :src="album.picUrl + '?param=650y650'" loading="lazy" />
          </div>
          <div class="disc-info">
            <h3>{{ album.name }}</h3>
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
              <SvgIcon name="play"></SvgIcon>
            </button>
            <img :src="recommendItem.picUrl" loading="lazy" />
          </div>
          <div class="recommend-playlist-info">
            <h4>{{ recommendItem.name }}</h4>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐歌单 end -->
  </div>
</template>

<script lang="ts" setup>
import {
  getNewAlbumAPI,
  getRecommendPlaylistAPI,
  getTopListAPI,
  getPlaylistDetailAPI,
} from "@/api/playlist";
import { getUserRecommendSongsListAPI, getPersonalFmAPI } from "@/api/user"
import { onBeforeMount, ref, reactive, shallowReactive } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useBaseStore } from '@/stores/user'
// import { LargerBanner } from '"@/components/LargerBanner/LargerBanner'
import NProgress from "nprogress"
// nprogress进度条展示
let isShow = ref(false);
// 过滤后的榜单数据列表
const topLists = reactive({
  items: [],
  ids: [19723756, 180106, 60198, 3812895, 60131],
});
// 新碟上架数据列表
const albumList = shallowReactive([]);
// 推荐歌单数据数据列表
const recommendPlaylist = ref([]);

// 私人fm歌曲名字
const songName = ref('');
// 私人fm歌手名字
const singerName = ref("");
// 私人fm歌曲Id
const personalId = ref("");
// 私人fm歌曲封面
const personalCover = ref("");
// 私人fm歌曲描述
const personalReason = ref("");

// 每日推荐歌曲名字
const userRecommend_songName = ref('');
// 每日推荐歌手名字
const userRecommend_singerName = ref("");
// 每日推荐歌曲Id
const userRecommend_personalId = ref("");
// 每日推荐歌曲封面
const userRecommend_songsCover = ref("");
// 每日推荐歌曲描述
const userRecommend_reason = ref("");

// 随机歌曲
const randomId = ref("");
const categoryBillboard = ref("排行榜");
const categoryDisc = ref("新碟上架");
const categoryRecommend = ref("推荐歌单");

// 定义路由
const router = useRouter()
const route = useRoute()
const store = useBaseStore()

onBeforeMount(() => {
  initData();
  // 页面加载进度条
  NProgress.start();
  setTimeout(() => {
    isShow.value = !isShow.value
  }, 200);
});
const initData = () => {
  // 获取所有榜单
  getTopListAPI().then((data) => {
    // 过滤指定key的数组
    topLists.items = data.list.filter((item) =>
      topLists.ids.includes(item.id)
    );
  });
  // 获取新碟上架数据
  getNewAlbumAPI(10).then((data) => {
    Object.assign(albumList, data.albums);
  });
  // 获取推荐歌单数据
  getRecommendPlaylistAPI(10).then((data) => {
    recommendPlaylist.value = data.result;
    NProgress.done()
  });
  getUserRecommendSongsList()
  getPersonalFm()
};
// 跳转每日推荐页面
function goToDaily() {
  // 字符串路径
  router.push("/daily/music");
};
// 跳转指定榜单详情页面
function goToRanking(value: string) {
  router.push({ name: "playlist", params: { songListId: value }, });
};
// 跳转新碟上架页面
function goToDisc(value: string) {
  // 命名的路由，并加上参数，让路由建立 url
  router.push({ name: "album", params: { songListId: value }, });
};
// 跳转推荐歌单详情页面
function goToRecommend(value: string) {
  router.push({ name: "playlist", params: { songListId: value }, });
};

// 获取每日推荐歌曲
async function getUserRecommendSongsList() {
  const { data, code } = await getUserRecommendSongsListAPI()
  if (code === 302) {
    console.log('登录后可使用日推');
  } else {
    const { id, name, reason, ar, al } = data.dailySongs[0]
    userRecommend_personalId.value = id
    userRecommend_songName.value = name
    userRecommend_reason.value = reason
    userRecommend_singerName.value = ar[0].name
    userRecommend_songsCover.value = al.picUrl
  }
}
function handleRecommend() {
  store.$patch((state) => {
    state.songId = userRecommend_personalId.value;
  });
}
// 获取私人FM歌曲
async function getPersonalFm() {
  const { data } = await getPersonalFmAPI()
  const { id, name, reason, album } = data[0]
  personalId.value = id
  songName.value = name
  personalReason.value = reason
  singerName.value = album.artists[0].name
  personalCover.value = album.blurPicUrl
}
async function handlePersonalFm() {
  // $patch是同步函数,handlePersonalFm函数改为异步函数,才能正常更新state.songId
  await getPersonalFm();
  store.$patch((state) => {
    state.songId = personalId.value;
  });
}
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
  padding-bottom: 100px;
  margin: auto;

  & .recommend {
    // 推荐部分
    width: 100%;
    height: 100%;

    & h1 {
      font-size: 35px;
      margin: 40px 0;
      text-align: left;
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

            & .reason {
              position: absolute;
              top: 5px;
              right: 5px;
              color: #c04e56;
              padding: 5px;
              font-size: 12px;
              background: #fdebe7;
              border-radius: 5px;
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
          padding: 5px 8px;
          font-size: 14px;
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
        font-size: 35px;
        color: #333;
        font-weight: 550;
      }

      & a {
        font-size: 18px;
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
            width: 200px;
            font-size: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
            padding: 12px 0em;
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

  & .recommend-playlist {
    // 推荐歌单
    width: 100%;
    height: 100%;
    padding-top: 50px;

    & .recommend-playlist-title {
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
            width: 200px;
            font-size: 18px;
            padding: 10px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
