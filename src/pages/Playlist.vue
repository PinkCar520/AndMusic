<template>
  <div class="playlist" v-show="isShow">
    <!-- banner区域 -->
    <BannerDetail :unifyData="detailList" />
    <!-- 歌曲列表 -->
    <TrackList :tracksData="tracksList" />
  </div>
</template>
<script lang="ts" setup>
import BannerDetail from "@/components/BannerDetail/BannerDetail.vue";
import TrackList from "@/components/TrackList/TrackList.vue";
import { getPlaylistDetailAPI } from "@/api/playlist";
import NProgress from "nprogress";
import { onBeforeMount, onMounted, ref, nextTick, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useBaseStore } from "@/stores/user"
const props = defineProps({
  songListId: {
    type: String,
    required: true
  }
})
console.log('setup');
onBeforeMount(() => {
  console.log('onBeforeMount');
})
onMounted(() => {
  console.log('onMounted');
})
onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
})
onUpdated(() => {
  console.log('onUpdated');
})
onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
})
onUnmounted(() => {
  console.log('onUnmounted');
})
onActivated(() => {
  console.log('activated');
})
onDeactivated(() => {
  console.log('onDeactivated');
})
// 定义歌曲的数据结构
interface Track {
  id: number;
  name: string;
  artist: string;
  al: Album;
  ar: Artist[];
  // 其他属性...
}
// 定义专辑信息的数据结构
interface Album {
  id: number;
  name: string;
  picUrl: string; // 添加 picUrl 属性
  // 其他专辑属性...
}
// 定义歌手信息的数据结构
interface Artist {
  id: number;
  name: string;
  // 其他歌手属性...
}
interface PlaylistData {
  tracks: Array<Track>;
}

const isShow = ref(false);
const detailList = ref<PlaylistData>({ tracks: [] });
const tracksList = ref<Track[]>([]);

// 定义路由/状态管理
const router = useRouter()
const route = useRoute()
const store = useBaseStore()

onBeforeMount(() => {
  getPlaylistDetail()
  nextTick(() => {
    if (!isShow.value) NProgress.start()
  });
});

// 处理歌单详情并更新存储的函数
function processPlaylistDetails(playlist: PlaylistData) {
  const playlistFormat = playlist.tracks.map((track) => track.id);
  store.$patch((state) => {
    state.playlist = playlistFormat;
  });
  return playlistFormat;
}
// 获取歌单详情
async function getPlaylistDetail() {
  try {
    const id = props.songListId as string
    const { playlist } = await getPlaylistDetailAPI(id)
    playlist.avatarUrl = playlist.creator.avatarUrl;
    detailList.value = { ...playlist };
    tracksList.value = playlist.tracks;
    processPlaylistDetails(playlist);
    isShow.value = true
    NProgress.done();
  } catch (error) {
    console.error('获取歌单详情时出错：', error);
    throw error;
  }
};
</script>