<template>
  <div class="header">
    <div class="container">
      <!-- 导航条 start -->
      <div class="header-link">
        <router-link to="/">首页</router-link>
        <router-link to="/discover">发现</router-link>
        <router-link to="/login/user">我的</router-link>
      </div>
      <!-- 导航条 end -->

      <!-- 功能区 start -->
      <div class="header-feature">
        <div class="header-search">
          <input type="search" class="search" value="" placeholder="搜索" @keyup.enter="searchEnter()"
            v-model="searchContent" />
          <svg-icon icon-class="search" class="search-icon" @click="searchEnter()"></svg-icon>
        </div>
        <div class="login-btn">
          <button @click="change">
            <svg-icon icon-class="user" class="user-icon"></svg-icon>
          </button>
        </div>
        <!-- user 隐藏 -->
        <div class="user-hide" v-show="isShow">
          <div @click="handleLogin">登录</div>
          <div>
            <div @click="handleQuit">退出</div>
          </div>
        </div>
        <!-- 登录弹窗 方案暂时废弃-->
        <!-- <div class="login-content" ref="popup" v-show="isLoginShow">
          <form action="post" class="reform">
            <div id="info" class="info"></div>
            <h2>登录网易云账号</h2>
            <div class="qr">
              <img id="qrImg"/>
              <p>请使用网易云APP扫码登录</p>
            </div>
          </form>
        </div> -->
      </div>
      <!-- 功能区 end -->
    </div>
  </div>
</template>
<script>
import { getSearchAPI } from "@/api/misc.js";
import { debounce } from "@/utils/common"
// 1. 编写NavBar组件
export default {
  name: "NavBar",
  data() {
    return {
      isShow: false,
      isLoginShow: false,
      isActive: false,
      scrollTop: "",
      searchSingerData: "",
      searchSingleData: '',
      searchAlbumData: '',
      // 搜索内容
      searchContent: ""
    };
  },
  methods: {
    change() {
      this.isShow = !this.isShow;
    },
    // 登录
    handleLogin() {
      this.$router.push({ name: "login" }); // 编程式导航到login页面
      this.isShow = !this.isShow;
    },
    // 退出
    handleQuit() {
      this.$router.push({ name: "home" }); // 编程式导航到login页面
      window.sessionStorage.removeItem('cookie')
      this.isShow = !this.isShow;
    },
    // 回车发送搜索请求
    searchEnter() {
      // 搜索内容不为空或undefined时,跳转到搜索页面
      if (!(this.searchContent === undefined || this.searchContent === " ")) {
        this.$router
          .push({
            name: "search",
            params: { id: this.searchContent },
          })
          .catch((err) => {
            console.log("重复搜索");
            return;
          });
        // 歌手信息
        getSearchAPI({ keywords: this.searchContent, type: 100 }).then((res) => {
          this.searchSingerData = res.data.result.artists;
          this.$bus.$emit("searchInfo", this.searchSingerData);
          // console.log(this.searchSingerData);
        });
        // 单曲
        getSearchAPI({ keywords: this.searchContent, type: 1 }).then((res) => {
          this.searchSingleData = res.data.result.songs;
          this.$bus.$emit("searchSingle", this.searchSingleData);
          console.log('单曲', res);
        });
        // 专辑
        getSearchAPI({ keywords: this.searchContent, type: 10 }).then((res) => {
          this.searchAlbumData = res.data.result.albums;
          this.$bus.$emit("searchAlbum", this.searchAlbumData);
          // console.log('专辑', res.data.result.albums);
        });
      }
      // 清空输入框
      this.searchContent = ''
    },

    // // 弹窗显示时监听点击事件
    // show() {
    //   document.addEventListener("click", this.hidePanel, false);
    // },
    // // 弹窗隐藏时撤销监听事件
    // hide() {
    //   document.removeEventListener("click", this.hidePanel, false);
    // },
    // // 只有当点击的元素属于弹窗或者 toggle 按钮才会执行 if 里面的代码
    // hidePanel(e) {
    //   if (
    //     !this.$refs.toggleButton.contains(e.target) &&
    //     !this.$refs.popup.contains(e.target)
    //   ) {
    //     this.isLoginShow = false;
    //     this.hide();
    //   }
    // },
    // handleLogin() {
    //   // this.isLoginShow = !this.isLoginShow;
    //   this.isShow = !this.isShow;
    //   if (this.isLoginShow) {
    //     this.show();
    //   } else {
    //     this.hide();
    //   }
    // },
  },
};
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
  // padding: 0 10vw;
  height: 70px;
  // background: rgb(236, 65, 65);
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
        height: 100px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
        // display: none;
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

      // & .login-content {
      //   // 登录弹窗 暂时废弃
      //   position: absolute;
      //   left: -210px;
      //   top: 200px;
      //   width: 400px;
      //   height: 450px;
      //   border-radius: 10px;
      //   background-color: #fff;
      //   box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      //   z-index: 2;
      //   & .reform {
      //     height: 100%;
      //     text-align: center;
      //     padding: 4em 0em;
      //     & .reform h2 {
      //       margin: 1em 0em;
      //     }
      //   }
      //   & .qr {
      //     border-radius: 10px;
      //     & img {
      //       width: 180px;
      //       height: 180px;
      //       border-radius: 10px;
      //       box-shadow: 0px 10px 20px rgba(78, 78, 78, 0.1);
      //       margin-bottom: 1em;
      //     }

      //     & p {
      //       height: 30px;
      //       line-height: 30px;
      //     }
      //   }
      // }
    }
  }
}

.header .search-icon {
  font-size: 18px;
  color: #000;
  cursor: pointer;
}
</style>