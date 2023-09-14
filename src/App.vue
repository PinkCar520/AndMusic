<template>
  <nav>
    <NavBar />
  </nav>
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
  <Player />
</template>
<script lang="ts" setup>
import NavBar from "@/components/NavBar/NavBar.vue";
import Player from "@/components/Player/Player.vue";
// import Lyric from "@/components/Lyric/Lyric.vue";
</script>
<style lang="scss">
html {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  min-width: 1423px;
  background-color: #f5f5f5;
  transition: all 0.4s;
}

* {
  margin: 0;
  padding: 0;
}


*,
:after,
:before {
  background-repeat: no-repeat;
  box-sizing: inherit;
}

/* myStyle 设置滚动条的样式 */

::-webkit-scrollbar {
  width: 10px;
}


/* 滚动槽 */

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 5px;
}


/* 滚动条滑块 */

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(170, 175, 177, 0.7);
}

.scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.scrollbar {
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}

img[lazy="loading"] {
  display: block;
  width: 50px !important;
  height: 50px !important;
  margin: 0 auto;
}

// 居中播放按钮 毛玻璃效果
.play {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  & button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    backdrop-filter: saturate(180%) blur(20px);
    background-color: rgba(255, 255, 255, 0.1);
    display: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    & svg {
      color: #fff;
    }
  }

  // 排行榜item
  & img {
    width: 220px;
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
  }
}

nav {
  height: 70px;
}

.play:hover button {
  display: block;
}

.play:hover img {
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.3);
}
</style>
