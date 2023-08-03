<template>
  <div class="header">
    <div class="container">
      <!-- 导航条 start -->
      <div class="header-link">
        <!-- 声明式导航 -->
        <router-link to="/">首页</router-link>
        <router-link to="/discover">发现</router-link>
        <router-link to="/login/user">我的</router-link>
      </div>
      <!-- 导航条 end -->

      <!-- 功能区 start -->
      <div class="header-feature">
        <div class="header-search">
          <input type="search" class="search" value="" placeholder="搜索" @keyup.enter="searchEnter()" />
          <SvgIcon name="search" class="search-icon" @click="searchEnter()"></SvgIcon>
        </div>
        <div class="login-btn">
          <button @click="onUserChange">
            <SvgIcon name="user"></SvgIcon>
          </button>
        </div>
        <!-- user 隐藏 -->
        <div class="user-hide" v-show="isShowSetting">
          <div v-if="!store.isLogin" @click="handleLogin">登录</div>
          <div v-else @click="handleQuit">退出</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import auth from "@/utils/auth";
import { getSearchAPI } from "@/api/misc";
import { getLogoutAPI } from "@/api/auth";
import { onMounted, ref } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useBaseStore } from "@/stores/user";
import { ElMessage } from "element-plus";
const isShowSetting = ref(false)
const router = useRouter()
const route = useRoute()
const store = useBaseStore()

// 添加事件监听，当组件挂载时绑定事件
onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});
const handleDocumentClick = (event: { target: any }) => {
  const target = event.target;
  const userHide = document.querySelector('.user-hide');
  const button = document.querySelector('button');

  // 如果点击事件的目标不在音乐列表内且不是按钮，则隐藏音乐列表
  if (userHide && !userHide.contains(target) && !button?.contains(target)) {
    hideSetting();
  }
};
const hideSetting = () => {
  isShowSetting.value = false;
};
function onUserChange() {
  isShowSetting.value = !isShowSetting.value;
};
// 搜索事件
function searchEnter() {
  console.log("搜索事件");
}
const handleLogin = () => {
  isShowSetting.value = false
  router.push({
    path: "/login",
    query: {
      redirect: route.fullPath
    }
  })
  console.log(route);
  
}
const handleQuit = (async () => {
  if (await auth()) {
    getLogoutAPI().then(() => {
      isShowSetting.value = false
      store.onLoginChange(false);
      window.localStorage.removeItem('cookie')
      ElMessage({
        message: "退出成功",
        type: 'success',
        duration: 3 * 1000,
      })
      // 编程式导航
      router.push('/')
    })
  }
})
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}

ul {
  list-style: none;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  height: 70px;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(255, 255, 255, 0.72);
  width: 100%;

  & a {
    color: #000;
  }

  & .container {
    // 两边留白设计
    width: 1180px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;

    & .header-link {
      // 首页-发现-我的
      display: flex;
      flex: 1 1 auto;

      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;

      & a {
        // color: #fff;
        font-size: 20px;
        font-weight: 550;
        // padding: 5px 10px;
        margin: 0 20px;
      }
    }

    & .header-feature {
      // 登录-搜索功能区
      position: relative;
      display: flex;
      flex: 1 1 auto;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;


      & .header-search {
        display: flex;
        align-items: center;
        background-color: #f3f3f3;
        border-radius: 20px;
        padding: 8px 10px;


        & .search {
          // 搜索框
          border: none;
          outline: none;
          text-indent: 20px;
          background-color: #f3f3f3;
          font-size: 16px;
        }

        & input::-webkit-search-cancel-button {
          // 隐藏input框的X符号
          display: none;
        }

      }

      & .login-btn {
        & button {
          // 登录按钮
          flex: 1;
          border: none;
          outline: none;
          background-color: transparent;
          cursor: pointer;
          display: flex;
        }
      }

      & .user-hide {
        // 登录/隐藏
        position: absolute;
        right: 70px;
        top: 80px;
        width: 100px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
        z-index: 1;

        & div {
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-weight: bold;
          cursor: pointer;
          color: #333;
        }
      }
    }
  }
}

.header .search-icon {
  width: 1em;
  height: 1em;
  color: #000;
}
</style>