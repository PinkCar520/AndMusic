import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 存储数据
const state = ({
  // 歌曲id
  songId: '',
  // 播放条显示与隐藏
  // 歌词页面显示与隐藏
  isLyricShow: false,
  audio: '', // audio的Dom元素
  playlist: [], //播放列表
  playContent: {}, //当前播放的歌曲信息
  current: "" //当前歌曲的播放进度
})
const getters = ({})
// 操作数据
const mutations = ({
  saveData(state, value) {
    state.audio = value;
  },
  change(state, value) {
    state.isLyricShow = value;
  },
  saveMusicPlaylist(state, value) {
    state.playlist = value;
  },
  saveMusicId(state, value) {
    state.songId = value;
  }
})
// 响应组件的动作
const actions = ({
  // 保存
  save(content, value) {
    content.commit("saveData", value);
  },
  // 修改
  change(content, value) {
    setTimeout(() => {
      content.commit('change', value)
    }, 30)
  },
  // 保存音乐列表数组
  MusicPlaylist(content, value) {
    content.commit('saveMusicPlaylist', value);
  },
  // 保存音乐id
  MusicId(content, value) {
    content.commit('saveMusicId', value);
  }
})

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})