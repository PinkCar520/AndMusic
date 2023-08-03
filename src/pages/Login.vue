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
            <SvgIcon name="success"></SvgIcon>
            <p class="info">扫码成功</p>
            <p class="hint">请在手机上确认授权登录</p>
          </div>
          <div class="scan-qr" v-else-if="qrCode === 803">
            <SvgIcon name="success"></SvgIcon>
            <p class="info">登录成功</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import {
  getLoginQrCodeKeyAPI,
  getLoginQrCodeCreateAPI,
  getLoginQrCodeCheckAPI,
} from "@/api/auth";
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { getLoginStatusAPI } from "@/api/user";

const qrCodeKey = ref("");
const qrImg = ref("");
const qrMessage = ref("");
const qrCode = ref("");
const qrCodeInfo = ref("");
const router = useRouter()
const route = useRoute()

let QrCodeCheckInterval; // 定义在全局作用域中
async function checkQrCodeStatus() {
  const { code, message, cookie } = await getLoginQrCodeCheckAPI(qrCodeKey.value);
  qrMessage.value = message;
  qrCode.value = code;

  if (qrCode.value === 801) {
    console.log(qrMessage.value);
  } else if (qrCode.value === 802) {
    console.log(qrMessage.value);
  } else if (qrCode.value === 803) {
    // 停止检测
    clearInterval(QrCodeCheckInterval);
    console.log(QrCodeCheckInterval, 'QrCodeCheckInterval');
    ElMessage({
      message: qrMessage.value,
      type: "success",
      duration: 3 * 1000,
    });
    window.localStorage.setItem('cookie', cookie);
    if (window.localStorage.getItem('cookie')) {
      console.log(route, 'route');
      const redirectUrl = route.query.redirect
      router.push({ path: redirectUrl });
    }
  }
}

getLoginQrCodeKeyAPI()
  .then((res) => {
    qrCodeKey.value = res.data.unikey;

    // 2. 根据获取的key生成二维码图片
    return getLoginQrCodeCreateAPI({
      key: qrCodeKey.value,
      qrimg: true,
    });
  })
  .then((res) => {
    qrImg.value = res.data.qrimg;

    // 3. 二维码检测扫码状态接口
    QrCodeCheckInterval = setInterval(checkQrCodeStatus, 3000);
  });

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