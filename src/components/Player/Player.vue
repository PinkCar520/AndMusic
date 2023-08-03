<template>
  <div>
    <div class="player" :class="{ unlock: isLockStatus }">
      <!-- 原生audio标签 -->
      <audio ref="audioRef" :src="musicUrl" preload="auto" @canplay="ready" @timeupdate="updateTime" @ended="end"
        autoplay>
      </audio>
      <!-- 音频播放器控制条 -->
      <div class="player-container">
        <!-- 缩略图 -->
        <div class="thumbnail-info">
          <div class="thumbnail" title="缩略图" @click="musicPlayer()">
            <button>
              <SvgIcon name="up"></SvgIcon>
            </button>
            <img class="thumb-img" :src="musicDetail.picUrl + '?param=112y112'" />
          </div>
          <div class="thumbnail-title">
            <h3>{{ musicName }}</h3>
            <a href="#">{{ singerName.name }}</a>
          </div>
        </div>
        <div class="btn">
          <!-- 上一首 -->
          <button class="previous" title="上一首" @click="store.musicPrev()">
            <SvgIcon name="prev"></SvgIcon>
          </button>
          <!-- 播放暂停 -->
          <button class="play-pause" title="暂停" @click="musicPlay()">
            <SvgIcon :name="isPaused ? 'play-big' : 'pause'"></SvgIcon>
          </button>
          <!-- 上一首 -->
          <button class="next" title="下一首" @click="store.musicNext()">
            <SvgIcon name="next"></SvgIcon>
          </button>
        </div>
        <!-- 其他按钮 -->
        <div class="control">
          <div class="control-info">
            <!-- 音乐列表 -->
            <button title="音乐列表" @click.stop="toggleMusicList()">
              <SvgIcon name="music-list"></SvgIcon>
            </button>
            <div class="music-list" v-if="showMusicList">
              <div class="title">
                当前播放({{ playingList.length }})
              </div>
              <div class="song-list">
                <!-- 歌曲渲染 -->
                <div class="playing-item" v-for="item in playingList" :key="item.id" @click="selectTrack(item.id)"
                  :class="{ activeSongColor: isActiveSongColor === item.id }">
                  <span class="songName">{{ item.name }}</span>
                  <span>-</span>
                  <span class="singer">{{ item.ar[0].name }}</span>
                </div>
              </div>
            </div>
            <!-- 循环、随机、单曲循环 -->
            <button class="stochastic" :title="playModeTexts[playMode]" @click="onplayModeChange()">
              <SvgIcon :name="playModeIcons[playMode]"></SvgIcon>
            </button>
            <!-- 音量开关 -->
            <button class="volume" title="音量" @click="setMuted()">
              <SvgIcon :name="isMuted ? 'mute' : 'volume'"></SvgIcon>
            </button>
          </div>
          <!-- 音量拖动条 -->
          <div class="progress-bar">
            <vue-slider v-model="volumeValue" :min="0" :max="1" :interval="0.01" :tooltip="'none'" :drag-on-click="true"
              @change="onVolumeChange"></vue-slider>
          </div>
          <!-- 解锁 -->
          <div class="lock-bar">
            <button @click.stop="onLockChange()">
              <SvgIcon :name="isLockStatus ? 'lock' : 'unlock'"></SvgIcon>
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
              <SvgIcon name="down"></SvgIcon>
            </button>
          </div>
          <!-- 封面/音频 -->
          <!-- 封面区域 -->
          <div class="cover">
            <img :src="musicDetail.picUrl + '?params=512y512'" v-if="store.songId != null" />
          </div>
          <!-- 音频控制条 -->
          <div class="controls">
            <div class="music-controls">
              <button class="previous" title="上一首" @click="store.musicPrev()">
                <SvgIcon name="prev"></SvgIcon>
              </button>
              <button class="play-pause" title="暂停" @click="musicPlay()">
                <SvgIcon :name="isPaused ? 'play-big' : 'pause'"></SvgIcon>
              </button>
              <button class="next" title="下一首" @click="store.musicNext()">
                <SvgIcon name="next"></SvgIcon>
              </button>
            </div>
            <!-- 播放进度条 -->
            <div class="progress-bar">
              <vue-slider v-model="audio_play_duration" :min="0" :max="1" :interval="0.01" :tooltip="'none'"
                :drag-on-click="true" @change="onPlayDurationChange"></vue-slider>
            </div>
            <div class="time">
              <span class="initial-time">{{ showTime(currentTime) }}</span>
              <span class="total-time">{{ showTime(durationTime) }}</span>
            </div>
          </div>
        </div>
        <!-- 歌词区域 -->
        <div class="lyrics-container" ref="lyricsContainer">
          <div class="lyrics">
            <div v-for="(   line, index   ) in    lyricsArray   " :key="index" :class="getLyricClass(index)">
              {{ line.content }}
            </div>
          </div>
        </div>
      </div>
      <!-- 亚克力 -->
      <div class="blur-glass"
        :style="'background-image: url(' + musicDetail.picUrl + ');opacity: 1;transform: scale(1.5);transform-origin: center center;filter: blur(30px);'">
        ></div>
    </div>
  </div>
</template>

<script setup>
import VueSlider from "vue-slider-component";
import 'vue-slider-component/theme/antd.css';
import { getLyricAPI } from "@/api/playlist";
import { getSongDetailAPI, getMusicUrlAPI } from "@/api/song";
import { formatDuration } from "@/utils/common";
import { useBaseStore } from "@/stores/user"
import { useAudioStore } from '@/stores/audio'
import { onBeforeUnmount, onMounted, onBeforeMount, onUnmounted, ref, reactive, shallowReactive, toRefs, watch, nextTick } from "vue"
// import usePlayer  from "@/utils/player"
const store = useBaseStore()
const audioStore = useAudioStore()
// audio的Dom元素
const audioRef = ref(null);
// 音乐url
const musicUrl = ref(null);
// 音乐是否暂停
const isPaused = ref(true);
// 播放条显示
const isLockStatus = ref(false);
// 歌曲详情
const musicDetail = ref([]);
const musicName = ref('');
// 歌手名字
const singerName = ref("");
// 播放列表显示与隐藏
const isPlayingList = ref(true);
const showMusicList = ref(false);
// 正在播放列表
const playingList = ref([]);

// 播放模式枚举
const playModes = ['SEQUENTIAL', 'LOOP_SINGLE', 'SHUFFLE'];
// SEQUENTIAL 顺序播放
// LOOP_SINGLE 单曲循环
// SHUFFLE 随机播放
const playMode = ref('SEQUENTIAL');
// 播放模式icon
const playModeIcons = {
  SEQUENTIAL: 'list-loop',
  LOOP_SINGLE: 'single-cycle',
  SHUFFLE: 'shuffle-play',
};
const playModeTexts = {
  SEQUENTIAL: '列表循环',
  LOOP_SINGLE: '单曲循环',
  SHUFFLE: '随机播放',
};
const volumeValue = ref(1);    // 音量初始值
const audio_play_duration = ref(0); // 音频时长初始值
const max_duration_time = ref(0); // 音频最大时长
const isMuted = ref(false); // 是否静音

const currentTime = ref(0);   // 当前播放时长
const durationTime = ref(0); // 音频总时长

const lyricsArray = ref([]); // 歌词数组
const currentLineIndex = ref(0); // 当前播放的歌词行索引
const lyricsContainerRef = ref(null); // 响应式引用，用于引用歌词容器

const isLyricShow = ref("");
const isActiveLyric = ref(false); // 默认播放器不显示
// // 播放列表音乐待激活状态
const isActiveSongColor = ref("");

// 订阅监听
store.$subscribe((mutation, state) => {
  // 获取音频url
  getMusicUrl();
  // 播放条的封面图和歌手信息
  musicData();
  if (state.songId !== state.previousSongId) {
    // 播放交互按钮切换
    musicListPlay();
    // 更新 previousSongId
    store.setPreviousSongId(state.songId);
  }
})
store.musicPrev()
store.musicNext()

// 获取歌曲url
async function getMusicUrl() {
  if (store.songId) {
    const { data } = await getMusicUrlAPI(store.songId)
    data.forEach((item) => {
      musicUrl.value = item.url
    });
  }
};
// 获取音乐列表
async function getPlayingList() {
  const { songs } = await getSongDetailAPI(store.playlist.toString())
  playingList.value = songs;
}

const toggleMusicList = () => {
  getPlayingList();
  showMusicList.value = !showMusicList.value;
};
// 添加事件监听，当组件挂载时绑定事件
onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  const $audio = audioRef.value
  volumeValue.value = audioStore.volume
  $audio.volume = audioStore.volume

  // 在页面加载时检查本地存储中是否保存有播放状态，并恢复播放
  if ($audio.paused) {
    isPaused.value = true;
  }
});

const handleDocumentClick = (event) => {
  const target = event.target;
  const musicList = document.querySelector('.music-list');
  const button = document.querySelector('button');

  // 如果点击事件的目标不在音乐列表内且不是按钮，则隐藏音乐列表
  if (musicList && !musicList.contains(target) && !button.contains(target)) {
    hideMusicList();
  }
};

const hideMusicList = () => {
  showMusicList.value = false;
};
// 监听音频加载,做一些初始化的动作
function ready() {
  const $audio = audioRef.value;
  durationTime.value = $audio.duration;
  max_duration_time.value = $audio.duration;
  // getLyric()
}
// 监听当前音频的时长更新
function updateTime(e) {
  currentTime.value = e.target.currentTime
  audio_play_duration.value = currentTime.value / durationTime.value
};
// 播放
function playLogic() {
  const $audio = audioRef.value;

  if (!$audio) {
    console.warn('音频元素不存在，无法进行播放逻辑');
    return;
  }

  if ($audio.paused) {
    // 播放音频
    playAudio($audio);
  } else {
    // 暂停音频
    pauseAudio($audio);
  }
};

function playAudio(audio) {
  // 先暂停，然后音频再播放
  pauseAudio(audio);
  audio.play();
}

function pauseAudio(audio) {
  // 暂停音频
  audio.pause();
}

// 音乐列表/播放逻辑
function musicListPlay() {
  playLogic()
  isPaused.value = false
  isLockStatus.value = true;
}
// 音频播放条/暂停逻辑
function musicPlay() {
  playLogic()
  // 播放/暂停按钮
  isPaused.value = !isPaused.value
};

// 列表播放
function selectTrack(trackId) {
  isActiveSongColor.value = trackId
  store.$patch(state => {
    state.songId = trackId
  });
};

/**
 * 切换循环播放/单曲循环/随机播放模式
 */
const onplayModeChange = () => {
  const currentIndex = playModes.indexOf(playMode.value);
  playMode.value = playModes[(currentIndex + 1) % playModes.length];
};
/**
 * 监听音频播放结束
 */
function end(e) {
  const $audio = audioRef.value;

  if (!$audio) {
    console.warn('音频元素不存在，无法处理播放结束事件');
    return;
  }
  const currentPlayMode = playMode.value
  if (currentPlayMode === 'SEQUENTIAL') {
    store.musicNext();
  } else if (currentPlayMode === 'LOOP_SINGLE') {
    $audio.loop = true;
  } else if (currentPlayMode === 'SHUFFLE') {
    store.shufflePlay();
  } else {
    // 未知的循环模式，不做任何处理
    console.warn('未知的循环模式');
  }
}

/**
 * 音量按钮逻辑
 */
function setMuted() {
  const $audio = audioRef.value;
  $audio.muted = !$audio.muted;
  isMuted.value = $audio.muted;
}

/**
 * 设置音量
 */
function onVolumeChange(value) {
  audioStore.volumeChange(value)
  const $audio = audioRef.value;
  $audio.volume = audioStore.volume;
}
/**
 * 播放进度条
 */
function onPlayDurationChange(value) {
  const $audio = audioRef.value;
  audio_play_duration.value = value
  $audio.currentTime = value * $audio.duration
}
// 音频播放控制条_显示/隐藏
function onLockChange() {
  isLockStatus.value = !isLockStatus.value;
};
// 歌曲图片详情
async function musicData() {
  if (store.songId) {
    const { songs } = await getSongDetailAPI(store.songId)
    musicDetail.value = songs[0].al
    musicName.value = songs[0].name
    singerName.value = songs[0].ar[0]
  }
};
const musicPlayer = () => {
  isLyricShow.value = true
  isActiveLyric.value = true;
}
const goBack = () => {
  isLyricShow.value = false;
  isActiveLyric.value = false;
};
const showTime = (value) => {
  return formatDuration(value)
}
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

.activeColor .svgClass {
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
  background-color: rgba(25, 26, 32, .85);
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
    z-index: 100;


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
          color: hsla(0deg, 0%, 88.2%, 0.8);
        }
      }
    }

    & .lyrics-container {
      width: 300px;
      overflow: hidden;
      position: relative;

      .lyrics {
        padding: 5px;
      }

      .lyrics div {
        line-height: 1.5;
      }

      .current-line {
        color: #ff0000;
        font-weight: bold;
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
  background-color: #161824;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: auto 100%;
  -webkit-transform: scale(1.5);
  -ms-transform: scale(1.5);
  transform: scale(1.5);
  -webkit-transform-origin: center;
  -ms-transform-origin: center;
  transform-origin: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.lyric-page::before {
  content: " ";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .5);
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
<style lang="scss">
@import "@/assets/styles/slider.scss";
</style>@/stores/index
