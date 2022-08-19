<template>
  <div>
    <div class="player" :class="{ active: isActive, unlock: isUnlock }">
      <!-- 原生audio标签 -->
      <audio ref="audio" :src="musicUrl" preload="auto" muted="muted" @canplay="ready" @timeupdate="updateTime"
        @ended="end" autoplay>
        /> Your browser does not support t,. mnhe audio tag.
      </audio>
      <!-- 音频播放器控制条 -->
      <div class="player-container">
        <!-- 缩略图 -->
        <div class="thumbnail-info">
          <div class="thumbnail" title="缩略图" @click="musicPlayer()">
            <button>
              <svg-icon icon-class="up"></svg-icon>
            </button>
            <img class="thumb-img" :src="musicDetail.picUrl + '?param=112y112'" />
          </div>
          <div class="thumbnail-title">
            <h3>{{ musicDetail.name }}</h3>
            <a href="#">{{ singerName.name }}</a>
          </div>
        </div>
        <div class="btn">
          <!-- 上一首 -->
          <button class="previous" title="上一首" @click="musicPrev()">
            <svg-icon icon-class="prev"></svg-icon>
          </button>
          <!-- 播放暂停 -->
          <button class="play-pause" title="暂停" @click="musicPlay($refs.audio)" :class="{ asd: isAsd }">
            <svg-icon :icon-class="isPaused ? 'play-big' : 'pause'"></svg-icon>
          </button>
          <!-- 上一首 -->
          <button class="next" title="下一首" @click="musicNext()">
            <svg-icon icon-class="next"></svg-icon>
          </button>
        </div>
        <!-- 其他按钮 -->
        <div class="control">
          <div class="control-info">
            <!-- 音乐列表 -->
            <button title="音乐列表" @click="getPlayingList()">
              <svg-icon icon-class="music-list"></svg-icon>
            </button>
            <div class="music-list" v-show="isPlayingList">
              <div class="title">
                当前播放({{ playinglist.length }})
              </div>
              <div class="song-list">
                <!-- 歌曲渲染 -->
                <div class="playing-item" v-for="item in playinglist" :key="item.id" @click="selectTrack(item.id)"
                  :class="{ activeSongColor: isActiveSongColor === item.id }">
                  <span class="songName">{{ item.name }}</span>
                  <span>-</span>
                  <span class="singer">{{ item.ar[0].name }}</span>
                </div>
              </div>
            </div>
            <!-- 循环、随机、单曲循环 -->
            <button class="stochastic" title="列表循环" @click="musicLoop()">
              <svg-icon :icon-class="isLoop ? 'single-cycle' : 'list-loop'"></svg-icon>
            </button>
            <button title="随机播放" @click="musicShuffle()" :class="{ activeColor: isActive }">
              <svg-icon icon-class="shuffle-play"></svg-icon>
            </button>
            <!-- 音量开关 -->
            <button class="volume" title="音量" @click="musicVolume()">
              <svg-icon :icon-class="isMuted ? 'mute' : 'volume'"></svg-icon>
            </button>
          </div>
          <!-- 音量拖动条 -->
          <div class="progress-bar" ref="progressBar" @click="musicSetVolume">
            <vue-slider v-model="volumeValue" :tooltip="'none'"></vue-slider>
          </div>
          <!-- 解锁 -->
          <div class="lock-bar" v-show="isLockBarShow">
            <button @click.stop="lock()">
              <svg-icon :icon-class="isLock ? 'unlock' : 'lock'"></svg-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 歌词页面 start -->
    <div class="lyric-page" :class="{ activeLyric: isActiveLyric }">
      <div class="container">
        <!-- 功能区域 -->
        <div class="feature">
          <!-- 返回按钮 -->
          <div class="go-back" @click="goBack()">
            <button class="previous" title="返回">
              <svg-icon icon-class="down"></svg-icon>
            </button>
          </div>
          <!-- 封面/音频 -->
          <!-- 封面区域 -->
          <div class="cover">
            <img :src="detailpicUrl + '?params=512y512'" v-if="this.songId != null" />
          </div>
          <!-- 音频控制条 -->
          <div class="controls">
            <div class="music-controls">
              <button class="previous" title="上一首" @click="musicPrev()">
                <svg-icon icon-class="prev"></svg-icon>
              </button>
              <button class="play-pause" title="暂停" @click="musicPlay()">
                <svg-icon :icon-class="isPaused ? 'play-big' : 'pause'"></svg-icon>
              </button>
              <button class="next" title="下一首" @click="musicNext()">
                <svg-icon icon-class="next"></svg-icon>
              </button>
            </div>
            <div class="progress-bar">
              <vue-slider v-model="progressValue" :tooltip="'none'"></vue-slider>
            </div>
            <div class="time">
              <span class="initial-time">{{ currentTime | showTime }}</span>
              <span class="total-time">{{ durationTime | showTime }}</span>
            </div>
          </div>
        </div>
        <!-- 歌词区域 -->
        <div class="lyric-wrapper" ref="wrapper">
          <div class="player-lyric">
            <p v-for="(item, index) in lyricsArray" :key="index" class="lyric-item">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
      <!-- 亚克力 -->
      <!-- <div class="blur-glass"
        ></div> -->

      <!-- :style="'background-image: url(' + musicDetail.picUrl + ');opacity: 1;transform: scale(1.5);transform-origin: center center;filter: blur(30px);'">
      </div> -->
    </div>
    <!-- 歌词页面 end -->
  </div>
</template>

<script>
/**
 * @description:
 * @return {*}
 * @click 变量名称: 以music开头,功能性名词结尾 比如: musicPlay()
 * @data 定义 audio: 原生Dom元素 isPaused: true/false isLock:true/false isMuted:true/false value(音量): 0-100
 * @VueSlider 音量滑动条效果
 */
import SvgIcon from "@/components/SvgIcon.vue";
import VueSlider from "vue-slider-component";
import { getLyricAPI } from "@/api/playlist.js";
import { getSongDetailAPI, getMusicUrlAPI } from "@/api/song.js";
import "@/assets/css/slider.css";
import { formatDuration } from "@/utils/common";
import { mapState } from 'vuex'
export default {
  name: "Player",
  components: {
    SvgIcon, VueSlider
  },
  data() {
    return {
      isAsd: false,
      isPaused: true,
      isLoop: "",
      isMuted: "",
      isLock: true,
      // 播放列表显示与隐藏
      isPlayingList: "",
      isActive: false, // 随机播放
      songId: "", // 歌曲Id
      isActive: false, // 默认播放器不显示
      isUnlock: "", // 播放条显示
      isLyricShow: "",
      musicDetail: "", // 歌曲详情
      singerName: "", // 歌手名字
      isLockBarShow: false, // 解锁按钮显示与隐藏

      volumeValue: 100,    // 音量初始值
      progressValue: 0, // 音频时长初始值
      currentTime: 0,   // 当前播放时长
      durationTime: 0, // 音频总时长
      loopMode: 0, // 播放模式 0:列表循环 1:单曲循环 2:随机播放
      lyc: '',
      playinglist: '', // 正在播放列表
      playlist: [], // 音乐列表
      currentIndex: '', // 当前播放音乐的下标
      isShuffle: false, // 默认不随机播放
      musicRandomIndex: '', // 随机循环下标
      musicLyric: [],
      currentLyric: null,
      isLyricShow: "",
      isActiveLyric: false, // 默认播放器不显示
      isPaused: true,
      audio: '',
      lrcPar: {},
      lyricsArray: {
        ti: "", //歌曲名
        ar: "", //演唱者
        al: "", //专辑名
        by: "", //歌词制作人
        offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
        ms: [] //歌词数组{t:时间,c:歌词}
      },
      // 详情封面
      detailpicUrl: 'http://p1.music.126.net/fL9ORyu0e777lppGU3D89A==/109951167206009876.jpg',
      // 歌曲url
      musicUrl: '',
      // 播放列表音乐待激活状态
      isActiveSongColor: ""
    };
  },
  props: {
  },
  created() {
    this.shufflePlay()
    this.getLyric()
    this.CoverPlay()
    this.$store.watch((state, getters) => {
      this.isLyricShow = state.isLyricShow;
      this.isActiveLyric = state.isLyricShow;
    })
  },
  mounted() {
    let audio = this.$refs.audio;
    // 初始化某些值
    this.isMuted = audio.muted;
  },
  methods: {
    // 获取歌曲url
    async getMusicUrl() {
      const { data: res } = await getMusicUrlAPI(this.songId)
      res.data.forEach((item) => {
        this.musicUrl = item.url
      });

    },
    async getPlayingList() {
      this.isPlayingList = !this.isPlayingList
      this.playlist = this.$store.state.playlist
      // console.log(this.playlist.toString());
      const { data: res } = await getSongDetailAPI(this.playlist.toString())
      // console.log(res);
      this.playinglist = res.songs;
    },
    // 获取歌词信息
    async getLyric() {
      // 当前songId不存在,return
      if (this.songId === undefined) { return }
      const { data: res } = await getLyricAPI(this.songId)
      // console.log('歌词--', res);
      this.lrc = res.lrc.lyric
      const lrcPar = {
        ti: "", //歌曲名
        ar: "", //演唱者
        al: "", //专辑名
        by: "", //歌词制作人
        offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
        ms: [] //歌词数组{t:时间,c:歌词}
      }
      // 歌词拆分为数组
      const newStr = this.lrc.split('\n');
      // console.log(newStr);
      newStr.forEach((item, index) => {
        // 去除空格
        const apiece = item.replace(/(^\s*)|(\s*$)/g, "")
        //取[]间的内容
        var time = apiece.substring(apiece.indexOf("[") + 1, apiece.indexOf("]"));
        //分离:前后数字
        var s = time.split(":");

        if (isNaN(parseInt(s[0]))) { //不是数值
          for (var i in lrcPar) {
            if (i != "ms" && i == s[0].toLowerCase()) {
              lrcPar[i] = s[1];
            }
          }
        } else { //是数值
          var arr = apiece.match(/\[(\d+:.+?)\]/g); //提取时间字段，可能有多个
          var start = 0;
          for (var k in arr) {
            start += arr[k].length; //计算歌词位置
          }
          var content = apiece.substring(start); //获取歌词内容
          for (var k in arr) {
            var time = arr[k].substring(1, arr[k].length - 1); //取[]间的内容
            var s = time.split(":"); //分离:前后文字
            lrcPar.ms.push({ //对象{t:时间,c:歌词}加入ms数组
              time: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
              content: content
            });
          }
        }

        lrcPar.ms.sort(function (a, b) { //按时间顺序排序
          return a.time - b.time;
        })
        // console.log(lrcPar);
        this.lyricsArray = lrcPar.ms
        // console.log(this.lyricsArray);
        // console.log(this.lyricsArray.time);
      });
    },
    // 监听音频加载,做一些初始化的动作
    ready() {
      let audio = this.$refs.audio;
      this.durationTime = audio.duration;
      // if (audio.paused) {
      //   // 先暂停
      //   // audio.load()
      //   // audio.pause();
      //   this.$nextTick(() => {
      //     // 解决chrome等浏览器,音频无法正常播放的问题
      //     // 报错: The element has no supported sources.
      //     audio.play();
      //   });
      this.getLyric()
      // }
    },
    // 监听当前音频的时长更新
    updateTime(e) {
      // console.log(e);
      this.currentTime = e.target.currentTime
      // v-model双向绑定进度条
      this.progressValue = (this.currentTime / this.durationTime) * 100;
      // console.log(this.progressValue);
      this.currentTimeFormat = Math.round(e.target.currentTime);
      // const lyricItem = this.lyricsArray;
      // lyricItem.forEach((item) => {
      //   const playingTime = item.time;
      // })
      // if (this.lyricsArray.time === this.currentTimeFormat) {

      // }
    },
    // 监听音频播放结束
    end(e) {
      // 音频播放结束,执行自动播放下一首的逻辑
      if (this.loopMode === 0) {
        // 列表循环
        this.musicNext()
      } else if (this.loopMode === 1) {
        // 单曲循环
        this.$refs.audio.loop = true
      } else if (this.loopMode === 2) {
        // 随机播放
        this.shufflePlay()
      }
    },
    // 音乐列表播放逻辑
    musicListPlay() {
      this.isPaused = false;
      this.isLockBarShow = true;
    },
    // 音频播放条、暂停逻辑
    musicPlay() {
      // icon取反
      this.isAsd = !this.isAsd
      this.isPaused = !this.isPaused;
      let audio = this.$refs.audio;
      if (audio.paused) {
        // console.log("开始播放");
        audio.play();
      } else {
        // console.log("暂停播放");
        audio.pause();
      }
    },
    //上一首
    musicPrev() {
      // 从store 读取音乐列表
      this.playlist = this.$store.state.playlist
      // 从store 读取音乐Id
      this.songId = this.$store.state.songId;
      // 当前播放的歌曲所在的下标
      this.currentIndex = this.playlist.lastIndexOf(this.songId + '');
      // 处理边界值
      this.currentIndex == 0 ? this.currentIndex = this.playlist.length - 1 : this.currentIndex--;
      // console.log('当前音乐列表:', this.playlist);
      // console.log('当前播放音乐的下标:', this.currentIndex);
      // 播放歌曲
      this.songId = this.playlist[this.currentIndex];
    },
    //下一首
    musicNext() {
      // 从store 读取音乐列表
      this.playlist = this.$store.state.playlist
      // 从store 读取音乐Id
      this.songId = this.$store.state.songId;
      // 获取当前播放的歌曲所在的下标
      // console.log('当前音乐列表:', this.playlist);
      // console.log('当前音乐Id:', this.songId);
      this.currentIndex = this.playlist.lastIndexOf(this.songId + '');
      // console.log('当前播放的歌曲所在的下标', this.currentIndex);
      // 处理边界值
      this.currentIndex === this.playlist.length - 1 ? this.currentIndex = 0 : this.currentIndex++;
      // console.log('当前音乐列表:', this.playlist);
      // console.log('当前播放音乐的下标:', this.currentIndex);
      // audio播放
      this.songId = this.playlist[this.currentIndex];
    },
    // 循环、单曲循环逻辑
    musicLoop() {
      let audio = this.$refs.audio;
      // icon 取反
      this.isLoop = !this.isLoop;
      // 第一次点击loop变为true,二次点击loop变为false
      audio.loop = !audio.loop;
      if (audio.loop) {
        // 单曲循环
        this.loopMode = 1;
        // console.log('单曲循环');
      } else {
        // 列表循环
        this.loopMode = 0;
        // console.log('列表循环');
      }
    },
    // 随机播放
    musicShuffle() {
      this.isActive = !this.isActive;
      if (!this.loopMode === 2) {
        this.loopMode = 0;
        // console.log('正常模式播放');
      } else {
        this.loopMode = 2;
        // console.log('随机播放');
      }
    },
    // 随机播放的逻辑 Math.random随机生成下标,达到随机播放的效果
    shufflePlay() {
      // 从store 读取音乐列表
      this.playlist = this.$store.state.playlist;
      // 从store 读取音乐列表的length
      let length = this.$store.state.playlist.length
      // console.log(Math.round(Math.random() * length));
      // 随机生成音乐的下标
      this.musicRandom = Math.round(Math.random() * (length - 1))
      // console.log(this.musicRandom);
      // 播放音乐
      this.songId = this.playlist[this.musicRandom];
      // console.log(this.songId);
    },
    // 音量按钮逻辑
    musicVolume() {
      // icon取反
      this.isMuted = !this.isMuted;
      let audio = this.$refs.audio;
      if (!audio.muted) {
        // muted也是个布尔属性值，表示音频是否静音，默认不静音播放。
        audio.muted = true;
        // console.log("静音模式开启:" + audio.muted);
      } else {
        audio.muted = false;
        // console.log("静音模式关闭:" + audio.muted);
      }
    },
    // 设置音量
    musicSetVolume() {
      // // 根据滑块来设置音量
      let audio = this.$refs.audio;
      console.log(audio.volume);
      audio.volume = (this.volumeValue - 0) / 100;
      // 根据滑块来判断icon的变换
      if (audio.volume <= 0) {
        this.isMuted = true;
      } else if (audio.volume > 0) {
        this.isMuted = false;
      }
    },
    // 播放条显示/隐藏
    lock() {
      this.isLock = !this.isLock;
      this.isUnlock = !this.isUnlock;
    },
    // // 移入 暂时性bug,产生冒泡行为
    // mouseOver() {
    //   this.isActive = true;
    // },
    // // 移出
    // mouseLeave() {
    //   this.isActive = false;
    // },
    // 显示歌词页面
    musicPlayer() {
      this.isLyricShow = true;
      this.$store.dispatch('change', this.isLyricShow)
    },
    // 退出歌词页面
    goBack() {
      // 取反
      // console.log('123');
      this.isLyricShow = false;
      // 把修改后的值返回值给vuex
      this.$store.dispatch('change', this.isLyricShow)
      // console.log('目前设置isLyricShow的Boolean为:', this.isLyricShow);
      // console.log('目前Lyric查看到的isLyricShow的Boolean为:', this.$store.state.isLyricShow);
    },
    // 歌曲详情
    musicData() {
      if (this.songId === undefined) { return }
      getSongDetailAPI(this.songId).then((res) => {
        // console.log(res);
        this.musicDetail = res.data.songs[0].al
        this.detailpicUrl = res.data.songs[0].al.picUrl
        this.singerName = res.data.songs[0].ar[0]
        // console.log(this.musicDetail);
      })
    },
    // 封面播放逻辑
    CoverPlay() {
      // 监听store的SongId变化
      this.$store.watch((state, getters) => {
        this.songId = state.songId
      })
    },
    // 列表播放
    // ...mapActions({ selectTrack: 'MusicId' }), // 性能问题暂时注释
    selectTrack(value) {
      this.isActiveSongColor = value
      this.$store.dispatch('MusicId', value)
    }
  },
  computed: {

  },
  filters: {
    showTime(value) {
      return formatDuration(value)
    }
  },
  watch: {
    songId(newSongId, oldSongId) {
      if (oldSongId === newSongId || this.songId === undefined) {
        return
      } else {
        this.$store.dispatch("MusicId", newSongId);
        // 获取音频url
        this.getMusicUrl();
        // 播放交互按钮切换
        this.musicListPlay();
        // 播放条的封面图和歌手信息
        this.musicData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/* 阿里矢量图 */

* {
  margin: 0;
  padding: 0;
}

#lyric {
  width: 100%;
  height: 100%;
}

.player .svg-icon {
  font-size: 25px;
}

a {
  display: block;
  text-decoration: none;
}

.activeColor {
  color: #0f85ff;
  border-radius: 10px;
}

/* player start */

.player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 62px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-top: 2px solid #e5e5e5;
  transition: all 0.4s 0.2s ease-in-out;
  transform: translateY(100%);
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(255, 255, 255, 0.72);
  z-index: 100;

  .player-container {
    width: 1180px;
    height: 100%;
    margin: 0 auto;
    display: flex;

    .thumbnail-info {
      /* 缩略图*/
      width: 35%;
      display: flex;

      & .thumbnail {
        position: relative;
        display: flex;
        align-items: center;

        & img {
          width: 50px;
          height: 50px;
          border-radius: 5px;
          cursor: pointer;
        }

        & button {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 50px;
          color: #e4e4e4;
          background-color: rgba(0, 0, 0, 0.2);
          backdrop-filter: saturate(180%) blur(4px);
          border-radius: 5px;
          display: none;
        }
      }

      & .thumbnail:hover button {
        display: block;
      }

      & .thumbnail:hover svg {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        backdrop-filter: saturate(180%) blur(4px);
        border-radius: 5px;
      }

      & .thumbnail-title {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        padding: 0 10px;

        & h3 {
          font-weight: 500;
          // width: 170px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 18px;
        }

        & a {
          color: rgb(134, 134, 134);
          font-size: 13px;
        }
      }
    }

    & .control {
      /* 音频功能控制条*/
      position: relative;
      width: 28%;
      height: 100%;
      // line-height: 80px;
      display: flex;
      align-items: center;

      & .control-info {
        display: flex;
      }

      & .progress-bar {
        // 音量条
        position: relative;
        width: 100px;
        border-radius: 5px;
        cursor: pointer;

        & .active-bar {
          position: absolute;
          left: 0;
          top: 0;
          width: 0px;
          height: 100%;
          background-color: #333;
          border-radius: 5px;
        }
      }

      & .lock-bar {
        position: absolute;
        right: 0px;
        top: -37px;
        width: 70px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.01);
        font-size: 10px;
        border-radius: 35px 35px 0 0;
        cursor: pointer;
      }

      & .lock-bar:hover .player {
        display: block;
      }
    }
  }
}

/* player end */

/* 缩略图 end */

/* 播放类按钮 start */
.control .vue-slider-rail {
  background-color: #cb0c0c;
}

.control .progress-bar .vue-slider-process {
  background-color: #cb0c0c;
}

.btn {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  width: 50px;
  height: 40px;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  transition: all .25s linear;
  border-radius: 10px;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 播放类按钮 end */

// .control a {
//   display: block;
//   font-size: 12px;
//   margin: 0em 1em;
//   cursor: pointer;
//   float: left;
// }

.active,
.unlock {
  transform: translateY(0);
}

/* control end*/




// 歌词
.lyric-page {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 200;
  background-color: #f8b6f8;
  // background-color: rgba(25, 26, 32, .85);

  background-size: cover;
  // padding: 4rem 0;
  transition: all 0.4s 0.2s ease-in-out;
  transform: translateY(100%);
  // display: none;
  overflow: hidden;

  & .svg-icon {
    color: #f1f5f5;
  }

  & .container {
    width: 1000px;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;

    & .feature {
      // 功能区域
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      flex: 1;

      & .go-back {
        // 返回
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        & button {
          background-color: transparent;
          border: none;
        }
      }

      & .cover {
        // 封面
        display: flex;
        align-items: center;
        justify-content: center;

        & img {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.01);
          animation: ban 10s linear infinite;
        }
      }

      & .controls {
        // 音频控制条
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        & .music-controls {
          width: 300px;
          padding: 10px 0;
          display: flex;
          justify-content: space-evenly;
          align-items: center;

          & button {
            border: none;
            background-color: transparent;
          }
        }

        & .progress-bar {
          width: 300px;
          padding: 10px 0;
        }

        & .time {
          width: 300px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #a6a6a6;
        }
      }
    }

    .player-lyric {
      // 歌词区域
      // width: 60%;
      height: 100%;
      flex: 1;

      & .lyric-item {
        font-size: 20px;
        font-weight: 550;
      }
    }
  }
}

.lyric-box {
  .lyric {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 460px;
    overflow: hidden;

    .lyric-wrapper {
      width: 100%;
      margin: 0 auto;
      overflow: hidden;

      .lyric-text {
        // line-height: 40px;
        height: 40px;
        border-radius: 10px;
        margin: 6px 2px;
        font-size: 1.3rem;
        font-weight: 500;
        color: #cb0c0c;
        cursor: pointer;
        text-align: center;

        &:hover {
          // background: @lyric-background;
          // color: @color-dark;
        }

        &.active {
          // color: @color-theme;
        }

        &::after {
          // color: @color-blank;
        }
      }

      .no-lyric {
        // color: @color-dark;
        text-align: center;
      }
    }
  }
}

.lyric-page .container {
  width: 1180px;
  height: 100%;
  display: flex;
  flex-direction: row;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%)
}

// 模糊效果
.blur-glass {
  // background-color: #161824;
  // background-position: 50%;
  // background-repeat: no-repeat;
  // background-size: auto 100%;
  // -webkit-transform: scale(1.5);
  // -ms-transform: scale(1.5);
  // transform: scale(1.5);
  // -webkit-transform-origin: center;
  // -ms-transform-origin: center;
  // transform-origin: center;
  // position: fixed;
  // left: 0;
  // right: 0;
  // top: 0;
  // height: 100%;
  // overflow: hidden;
  // z-index: 1;
}

.lyric-page::before {
  // content: " ";
  // position: absolute;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // top: 0;
  // background-color: rgba(0, 0, 0, .5);
}

// 封面渲染效果
@keyframes ban {
  100% {
    transform: rotate(360deg);
  }
}

.svg-icon {
  cursor: pointer;
}

.activeLyric {
  transform: translateY(0);
}

// 音乐列表
.music-list {
  position: absolute;
  left: 0;
  top: -410px;
  width: 400px;
  height: 400px;
  background-color: #ffff;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.01);
  z-index: 13;
  padding: 0px 20px;
  display: flex;
  flex-direction: column;

  & .title {
    font-size: 18px;
    font-weight: 550;
    padding: 20px 0;
    color: #333;
  }

  & .song-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: scroll;

    & .playing-item {
      font-size: 14px;
      display: flex;
      padding: 15px 0;
      cursor: pointer;
      border-radius: 5px;
      margin: 5px 0;

      & span {
        padding: 0px 5px;
      }

      & .songName {
        color: #333;
        font-size: 14px;
        font-weight: 550;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & .singer {
        color: rgb(106, 106, 106);
      }
    }

    & .activeSongColor>span {
      color: #0f85ff !important;
    }

    // 音乐播放列表激活状态
    & .activeSongColor {
      background-color: #f1f1f1;
    }

    & .playing-item:hover {
      background-color: #f1f1f1;
    }
  }
}

.asd {
  transform: scale(1.1);
  transition: all 0.2s linear;
}

.lock-bar button:hover {
  background-color: transparent;
}
</style>