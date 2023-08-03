<template>
  <div class="playlist" v-show="isShow">
    <!-- banner区域 -->
    <BannerDetail :unifyData="albumLists"></BannerDetail>
    <!-- 歌曲列表 -->
    <TrackList :tracksData="albumSongs"></TrackList>
  </div>
</template>
<script lang="ts" setup>
import BannerDetail from "@/components/BannerDetail/BannerDetail.vue";
import TrackList from "@/components/TrackList/TrackList.vue";
import { getAlbumListAPI, AlbumResponse, Album, Songs } from "@/api/playlist";
import NProgress from "nprogress"
import { onBeforeMount, ref, nextTick, reactive } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useBaseStore } from '@/stores/user'
// 路由组件props传参
const props = defineProps({
  songListId: {
    type: String,
    required: true
  }
})
const isShow = ref(false);

// 定义路由
const router = useRouter()
const route = useRoute()
const store = useBaseStore()

// 详情数据列表
let albumLists: Album = reactive({
  blurPicUrl: '',
  publishTime: '',
  artist: {
    picUrl: ''
  },
  coverImgUrl: '',
  avatarUrl: '',
  updateTime: '',
});
// 歌曲列表
let albumSongs: Songs[] = reactive([]);
onBeforeMount(() => {
  getAlbumList()
  nextTick(() => {
    if (!isShow.value) NProgress.start()
  });
});
function formatAlbumData(album: Album) {
  return {
    ...album,
    coverImgUrl: album.blurPicUrl,
    avatarUrl: album.artist.picUrl,
    updateTime: album.publishTime,
  };
}
function generatePlaylist(songs: any[]) {
  const playlistFormat = songs.map((song: { id: any; }) => song.id)
  store.$patch((state) => {
    state.playlist = playlistFormat;
  });
  return playlistFormat;
}
async function getAlbumList() {
  try {
    const { album, songs } = await getAlbumListAPI(props.songListId) as AlbumResponse
    albumLists = formatAlbumData(album)
    albumSongs = songs
    generatePlaylist(songs)
    isShow.value = true;
    NProgress.done();
  }
  catch { }
};
</script>