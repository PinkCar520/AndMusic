import { defineStore } from "pinia";

interface useState {
  songId: any;
  previousSongId: any;
  playlist: Array<number | string>;
  userInfo: Object;
  userId: string;
  isLogin: boolean;
}
export const useBaseStore = defineStore("user", {
  state: (): useState => {
    return {
      songId: null,
      previousSongId: null,
      playlist: [],
      userInfo: {},
      userId: "",
      isLogin: false,
    };
  },
  getters: {
    // 当前歌曲在播放列表中的索引值
    currentIndex(state) {
      return state.playlist.lastIndexOf(state.songId);
    },
    // 当前播放列表的随机值
    musicRandom(state) {
      return Math.round(Math.random() * (state.playlist.length - 1));
    },
  },
  actions: {
    // 是否登录
    onLoginChange(val: boolean) {
      this.isLogin = val;
    },
    // 用于设置 previousSongId 的 action
    setPreviousSongId(newPreviousSongId: any) {
      this.previousSongId = newPreviousSongId;
    },
    musicPrev() {
      const prevIndex =
        this.currentIndex !== -1
          ? this.currentIndex === 0
            ? this.playlist.length - 1
            : this.currentIndex - 1
          : 0;
      this.songId = this.playlist[prevIndex];
    },
    musicNext() {
      const nextIndex =
        this.currentIndex !== -1
          ? this.currentIndex === this.playlist.length - 1
            ? 0
            : this.currentIndex + 1
          : 0;
      this.songId = this.playlist[nextIndex];
    },
    shufflePlay() {
      this.songId = this.playlist[this.musicRandom];
    },
    // updatePlaylist(songs: (string | number)[]) {
    //   this.playlist = songs;
    //   console.log(songs, "songs");
    //   console.log(this.playlist, "this.playlist");
    // },
  },
  persist: true,
});
