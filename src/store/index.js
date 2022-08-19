import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。用于响应组件内的动作
const actions = {
  // 修改
  change(content, value) {
    setTimeout(() => {
      content.commit("change", value);
    }, 30);
  },
  // 保存音乐列表数组
  MusicPlaylist(content, value) {
    content.commit("saveMusicPlaylist", value);
  },
  // 保存音乐id
  MusicId(content, value) {
    content.commit("saveMusicId", value);
  },
};
//更改 Vuex 的 store 中的状态的唯一方法是提交 mutation 同步  -- Devtools
// 操作数据(state)
const mutations = {
  change(state, value) {
    state.isLyricShow = value;
  },
  //
  saveMusicPlaylist(state, value) {
    state.playlist = value;
  },
  saveMusicId(state, value) {
    state.songId = value;
  },
};

// 存储数据
const state = {
  // 歌曲id
  songId: "",
  // 歌词页面显示与隐藏
  isLyricShow: false,
  //当前播放列表
  playlist: [],
  //当前播放的歌曲信息
  playContent: {},
  //当前歌曲的播放进度
  current: "",
};

// state 中派生出一些状态 类似计算属性
const getters = {};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
