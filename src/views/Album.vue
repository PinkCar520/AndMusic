<template>
  <div class="playlist" v-show="show">
    <!-- banner区域 -->
    <BannerDetail :unifyData="albumLists"></BannerDetail>
    <!-- 歌曲列表 -->
    <TrackList :tracksData="albumSongs"></TrackList>
  </div>
</template>
<script>
import fakeDetail from "./unifyData.json"
import BannerDetail from "@/components/BannerDetail/BannerDetail.vue";
import TrackList from "@/components/TrackList/TrackList.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { getAlbumListAPI } from "@/api/playlist";
import NProgress from "nprogress";
export default {
  name: "Album",
  components: {
    SvgIcon,
    BannerDetail,
    TrackList
  },
  data() {
    return {
      show: false,
      // 详情数据列表
      albumLists: {},
      // 歌曲列表
      albumSongs: [],
    };
  },
  created() {
    this.getAlbumList();
    setTimeout(() => {
      if (!this.show) NProgress.start();
    }, 100);
  },
  methods: {
    async getAlbumList() {
      const { data: res } = await getAlbumListAPI(this.$route.params.id)
      if (res.code == "200") {
        // 格式化处理
        res.album.coverImgUrl = res.album.blurPicUrl
        res.album.avatarUrl = res.album.artist.picUrl
        res.album.updateTime = res.album.publishTime
        for (var i in fakeDetail) {
          fakeDetail[i] = res.album[i]
        }
        // end_Data
        this.albumLists = fakeDetail;
        this.albumSongs = res.songs;
        NProgress.done();
        this.show = true
      }
    },
  },
};
</script>