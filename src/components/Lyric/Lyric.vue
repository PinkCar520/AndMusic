<template>
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
          <img src="https://p2.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg" />
        </div>
        <!-- 音频控制条 -->
        <div class="controls">
          <div class="music-controls">
            <button class="previous" title="上一首">
              <svg-icon icon-class="prev"></svg-icon>
            </button>
            <button class="play-pause" title="暂停" @click="musicPlay()">
              <svg-icon :icon-class="isPaused ? 'play-big' : 'pause'"></svg-icon>
            </button>
            <button class="next" title="下一首">
              <svg-icon icon-class="next"></svg-icon>
            </button>
          </div>
          <div class="progress-bar">
            <vue-slider v-model="value" :tooltip="'none'"></vue-slider>
          </div>
          <div class="time">
            <span class="initial-time">00:00</span>
            <span class="total-time">00:00</span>
          </div>
        </div>
      </div>
      <!-- 歌词区域 -->
      <div class="player-lyric" ref="lyric">
        <p>234</p>
      </div>
    </div>
  </div>
  <!-- 歌词页面 end -->
</template>
<script>
import VueSlider from "vue-slider-component";
import 'vue-slider-component/theme/antd.css'
export default {
  name: "Lyric",
  data() {
    return {
      value: 100,
      lyric: [],
      currentLyric: "",
      isLyricShow: "",
      isActiveLyric: false, // 默认播放器不显示
      isPaused: true,
      audio: ''
    };
  },
  created() {
    // Vuex 事件监听
    this.$store.watch((state, getters) => {
      this.isLyricShow = state.isLyricShow;
      this.isActiveLyric = state.isLyricShow;
    })
    // Bus事件监听
    // this.$bus.$on('isLyricValue', (res) => {
    //   this.isLyricShow = res;
    // })
  },
  components: {
    VueSlider
  },
  methods: {
    goBack() {
      // 取反
      this.isLyricShow = false;
      // 把修改后的值返回值给vuex
      this.$store.dispatch('change', this.isLyricShow)
      console.log('目前设置isLyricShow的Boolean为:', this.isLyricShow);
      console.log('目前Lyric查看到的isLyricShow的Boolean为:', this.$store.state.isLyricShow);
    },
    // 音频播放、暂停逻辑
    musicPlay() {
      // icon取反
      this.isPaused = !this.isPaused;
      let audio = this.$store.state.audio;
      console.log(this.$store.state.audio);
      if (audio.paused) {
        console.log("开始播放");
        audio.play();
      } else {
        console.log("暂停播放");
        audio.pause();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// v-show="isLyricShow"
/* lyric-page start */
* {
  margin: 0;
  padding: 0;
}

.lyric-page {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background-color: #606266;
  background-size: cover;
  padding: 4rem 0;
  transition: all 0.4s 0.2s ease-in-out;
  transform: translateY(100%);
  z-index: 100;

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
      justify-content: space-between;
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
          justify-content: center;
          align-items: center;

          & button {
            padding: 0 20px;
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
        }
      }
    }

    .player-lyric {
      // 歌词区域
      width: 60%;
      height: 500px;
      flex: 1;
    }
  }
}

// 封面渲染效果
@keyframes ban {
  100% {
    transform: rotate(360deg);
  }
}

.svg-icon {
  color: #c0c4cc;
  cursor: pointer;
}

.activeLyric {
  transform: translateY(0);
}
</style>