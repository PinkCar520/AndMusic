import { ref, shallowReactive, nextTick } from "vue";
import { useStore } from "@/store/index";
function usePlayer() {
  const store = useStore();
  // audio的Dom元素
  const audio = ref(null);
  // 歌曲Id
  const newSongId = ref("");
  // 歌曲list
  const newPlayList = shallowReactive([]);
  // 音乐url
  const musicUrl = ref(null);
  // 音乐是否暂停
  const isPaused = ref(true);
  // 播放条显示
  const isUnlock = ref(false);
  // 解锁按钮显示与隐藏
  const isLockBarShow = ref(false);
  // 歌曲详情
  const musicDetail = ref([]);
  // 歌手名字
  const singerName = ref("");
  // 播放列表显示与隐藏
  const isPlayingList = ref("");
  // 正在播放列表
  const playingList = ref([]);

  const loopMode = ref(0); // 播放模式 0:列表循环 1:单曲循环 2:随机播放
  const isLoop = ref(""); // 播放模式/按钮逻辑

  const volumeValue = ref(100); // 音量初始值
  const progressValue = ref(0); // 音频时长初始值
  const isMuted = ref(false); // 是否静音

  const isActiveColor = ref(false); // 随机播放按钮颜色
  // 播放
  const playLogic = () => {
    const $audio = audio.value;
    if ($audio.paused) {
      // 先暂停
      $audio.load();
      $audio.pause();
      nextTick(() => {
        $audio.play();
      });
    } else {
      $audio.pause();
    }
  };
  // 音频播放条/暂停逻辑
  const musicPlay = () => {
    playLogic();
    // 播放/暂停按钮
    isPaused.value = !isPaused.value;
  };
  //上一首
  const musicPrev = () => {
    let currentIndex = null;
    currentIndex = newPlayList.lastIndexOf(newSongId.value + "");
    currentIndex == 0
      ? (currentIndex = newPlayList.length - 1)
      : currentIndex--;
    store.$patch((state) => {
      state.songId = newPlayList[currentIndex];
    });
  };
  //下一首
  const musicNext = () => {
    let currentIndex = null;
    currentIndex = newPlayList.lastIndexOf(newSongId.value + "");
    currentIndex === newPlayList.length - 1
      ? (currentIndex = 0)
      : currentIndex++;
    store.$patch((state) => {
      state.songId = newPlayList[currentIndex];
    });
  };
  // 列表播放
  const selectTrack = (trackId) => {
    isActiveSongColor.value = trackId;
    store.$patch((state) => {
      state.songId = trackId;
    });
  };
  // 循环、单曲循环逻辑
  const musicLoop = () => {
    const $audio = audio.value;
    isLoop.value = !isLoop.value;
    $audio.loop = !$audio.loop;
    if ($audio.loop) {
      loopMode.value = 1;
    } else {
      loopMode.value = 0;
    }
  };
  // 随机播放
  const musicShuffle = () => {
    isActiveColor.value = !isActiveColor.value;
    if (!loopMode.value === 2) {
      loopMode.value = 0;
    } else {
      loopMode.value = 2;
    }
  };
  // 监听音频播放结束
  const end = (e) => {
    const $audio = audio.value;
    if (loopMode.value === 0) {
      musicNext();
    } else if (loopMode.value === 1) {
      $audio.loop = true;
    } else if (loopMode.value === 2) {
      shufflePlay();
    }
  };
  // 随机逻辑
  const shufflePlay = () => {
    musicRandom = Math.round(Math.random() * (length - 1));
    newSongId.value = playlist[musicRandom];
  };
  // 音量按钮逻辑
  const musicVolume = () => {
    const $audio = audio.value;
    isMuted.value = !isMuted.value;
    $audio.muted ? ($audio.muted = false) : ($audio.muted = true);
  };
  // 设置音量
  const musicSetVolume = () => {
    const $audio = audio.value;
    $audio.volume = (volumeValue.value - 0) / 100;
    $audio.volume > 0 ? (isMuted.value = false) : (isMuted.value = true);
  };
  // 播放条显示/隐藏
  const lock = () => {
    isUnlock.value = !isUnlock.value;
  };
  return {
    audio,
    musicUrl,
    newSongId,

    playLogic, // start 音频交互逻辑
    musicPlay,
    musicPrev,
    musicNext, // end 音频交互逻辑

    // start 列表播放
    playingList,
    isPlayingList,
    selectTrack, // end 列表播放

    musicLoop, //  start 播放模式
    isLoop,
    musicShuffle,
    shufflePlay,
    end, // end 播放模式

    musicVolume, // start 音量
    musicSetVolume,
    volumeValue,
    progressValue,
    isMuted, // end 音量

    isLockBarShow, // start 播放条显示
    isUnlock,
    lock,
    isPaused, //end 播放条显示

    musicDetail, // start 歌曲详情
    singerName, // end 歌曲详情

    isActiveColor, // hover颜色
  };
}
export default usePlayer;
