<template>
  <div class="login">
    <div class="login-content" ref="popup">
      <form action="post" class="reform">
        <div class="title">
          使用 <a href="https://music.163.com/#/download">网易云音乐APP</a> 扫码登录
        </div>
        <div class="qr-img">
          <img :src="qrImg" alt="" />
        </div>
        <div>
          <div class="scan-qr" v-if="qrCode === 802">
            <svg-icon icon-class="success"></svg-icon>
            <p class="info">扫码成功</p>
            <p class="hint">请在手机上确认授权登录</p>
          </div>
          <div class="scan-qr" v-else-if="qrCode === 803">
            <svg-icon icon-class="success"></svg-icon>
            <p class="info">登录成功</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {
  getLoginQrCodeKeyAPI,
  getLoginQrCodeCreateAPI,
  getLoginQrCodeCheckAPI,
} from "@/api/auth";
import SvgIcon from '../components/SvgIcon.vue';
export default {
  components: { SvgIcon },
  name: "Login",
  data() {
    return {
      qrCodeKey: "",
      qrImg: "",
      qrMessage: "",
      qrCode: "",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // 1. 二维码 key 生成接口
      getLoginQrCodeKeyAPI().then((res) => {
        this.qrCodeKey = res.data.data.unikey;
        // console.log("key:" + this.qrCodeKey);

        // 2. 根据获取的key 生成二维码图片
        getLoginQrCodeCreateAPI({
          key: this.qrCodeKey,
          qrimg: true,
        }).then((res) => {
          this.qrImg = res.data.data.qrimg;
          // console.log("二维码base信息:" + this.qrImg);
        });

        // 3. 二维码检测扫码状态接口
        const QrCodeCheckInterval = setInterval(() => {
          getLoginQrCodeCheckAPI(this.qrCodeKey).then((res) => {
            console.log(res);
            this.qrMessage = res.data.message;
            this.qrCode = res.data.code;
            if (this.qrCode === 801) {
              console.log('等待扫码');
            } else if (this.qrCode === 802) {
              // 扫描成功
              this.qrCodeInfo = "扫描成功，请在手机上确认登录";
            } else if (this.qrCode === 803) {
              // 停止检测
              clearInterval(QrCodeCheckInterval);
              // 扫码授权成功 这一步会返回cookie
              // cookie保存到客户端的sessionStorage
              window.sessionStorage.setItem("cookie", res.data.cookie);
              if (window.sessionStorage.getItem("cookie")) {
                this.$router.push('/login/user')
              }
            }
          });
        }, 2000);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  width: 1180px;
  height: calc(100vh - 70px);
  margin: 0px auto;
  display: flex;
  justify-content: center;
  align-items: center;

  & .login-content {
    // 登录
    width: 400px;
    height: 450px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    text-decoration: none;

    & .title {
      & a {
        text-decoration: none;
        color: #0c73c2;
      }
    }

    & .reform {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;

      & .reform h2 {
        margin: 1em 0em;
      }
    }

    & .qr-img {
      & img {
        border-radius: 10px;
        width: 180px;
        height: 180px;
        border-radius: 10px;
        border: none;
        box-shadow: 0px 10px 20px rgba(78, 78, 78, 0.1);
      }
    }

    & p {
      height: 30px;
      line-height: 30px;
    }
  }
}

.scan-qr {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .info {
    color: rgb(82, 196, 26);
  }

  & .hint {
    color: #333;
    font-size: 13px;
  }
}
</style>