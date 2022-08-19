<template>
  <div class="playlist" v-show="show">
    <!-- banner区域 -->
    <BannerDetail :unifyData="detailList"></BannerDetail>
    <!-- 歌曲列表 -->
    <TrackList :tracksData="tracksList"></TrackList>
  </div>
</template>
<script>
import fakeDetail from "./unifyData.json"
import BannerDetail from "@/components/BannerDetail/BannerDetail.vue";
import TrackList from "@/components/TrackList/TrackList.vue";
import SvgIcon from "@/components/SvgIcon.vue";
import { getPlaylistDetailAPI } from "@/api/playlist";
import NProgress from "nprogress";
export default {
  name: "Playlist",
  components: {
    SvgIcon,
    BannerDetail,
    TrackList
  },
  data() {
    return {
      show: false,
      // 详情数据列表
      detailList: {},
      // 歌曲数据列表
      tracksList: [],
      // 版权信息检验 1 = VIP付费音乐
      isCopyright: true,
      // 版权提示
      hit: 'VIPOnly',
    };
  },

  created() {
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
      res.playlist.avatarUrl = res.playlist.creator.avatarUrl;
      for (var i in fakeDetail) {
        fakeDetail[i] = res.playlist[i]
      }
      this.detailList = fakeDetail;
      // 歌曲数据列表
      this.tracksList = res.playlist.tracks;
      NProgress.done();
      // 创建新歌曲id列表
      let str = ''
      this.tracksList.forEach((e) => {
        str += e.id + ',';
      });
      str = str.substring(0, str.length - 1);
      const playlist = str.split(',')
      // 传音乐列表数组给vuex
      this.$store.dispatch("MusicPlaylist", playlist);
      this.show = true
    },
  },
};
</script>