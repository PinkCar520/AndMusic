<template>
  <div class="discover" v-show="discoverData.isShow">
    <div class="main">
      <!-- 左侧边栏分类按钮 -->
      <Sidebar :categoryList="discoverData.categoryList" @onCategoryClick="goToCat" />
      <!-- 右侧边栏主体内容 -->
      <ContentArea :discoverData="discoverData" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  getPlaylistCatAPI,
  getTopListAPI,
  getRecommendPlaylistAPI,
  getNewAlbumAPI,
  getNewSongAPI,
  DiscoverComponentData
} from "@/api/playlist";
import NProgress from "nprogress";
import { defineAsyncComponent, onBeforeMount, ref, reactive } from "vue"
import { useRouter, useRoute } from "vue-router"

const Sidebar = defineAsyncComponent(() => import("@/components/Sidebar/Sidebar.vue"));
const ContentArea = defineAsyncComponent(() => import("@/components/ContentArea/ContentArea.vue"))

// 使用reactive为组件中的响应式数据添加类型声明
const discoverData: DiscoverComponentData = reactive({
  isShow: false,
  playlists: [],
  list: [],
  result: [],
  albums: [],
  categoryList: ["全部", "排行榜", "推荐歌单", "新碟上架", "新歌速递"],
  catTag: "",
  isImgUrl: true,
  isCountShow: true,
  isTopListShow: false,
});

// 定义路由
const router = useRouter();

onBeforeMount(async () => {
  await getPlaylistCat();
  setTimeout(() => {
    if (!discoverData.isShow) NProgress.start()
  }, 300)
});
async function getPlaylistCat() {
  const { playlists } = await getPlaylistCatAPI('全部')
  discoverData.playlists = playlists;
  NProgress.done();
  discoverData.isShow = true
};
async function goToCat(category: string) {
  discoverData.catTag = category
  // 根据category来判断请求
  switch (category) {
    case "全部":
      // 获取全部歌单
      const { playlists } = await getPlaylistCatAPI('全部')
      discoverData.playlists = playlists;
      discoverData.isImgUrl = true;
      discoverData.isCountShow = true
      break;
    case "排行榜":
      // 获取排行榜
      const { list } = await getTopListAPI()
      discoverData.playlists = list;
      discoverData.isImgUrl = true;
      discoverData.isCountShow = false
      discoverData.isTopListShow = true
      break;
    case "推荐歌单":
      // 获取推荐歌单数据
      const { result } = await getRecommendPlaylistAPI(100)
      discoverData.playlists = result;
      discoverData.isImgUrl = false;
      discoverData.isCountShow = true
      break;
    case "新碟上架":
      const { albums } = await getNewAlbumAPI(100)
      discoverData.playlists = albums;
      discoverData.isImgUrl = false;
      discoverData.isCountShow = false
      discoverData.isTopListShow = false
      break;
    case "新歌速递":
      const { data } = await getNewSongAPI(0)
      // 使用 map 对数据进行处理，将 album.picUrl 提取到第一层级
      const processedData = data.map((obj: { picUrl: string; album: []; id: number; }) => {
        const { picUrl, album, id } = obj;
        return { picUrl, ...album, id };
      });
      discoverData.playlists = processedData;
      discoverData.isImgUrl = false;
      discoverData.isCountShow = false
      discoverData.isTopListShow = false
      break;
    default:
      break;
  }

  // 路由query方式跳转
  router.push({
    name: "discover",
    query: {
      cat: category,
    },
  }).catch((error) => {
    return;
  });
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
    font-size: 20px;
  }

  & .main {
    display: flex;
    flex-direction: row;


  }
}
</style>