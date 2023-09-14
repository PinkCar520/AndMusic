import { getLoginStatusAPI } from "@/api/user";
import {
  getLoginQrCodeKeyAPI,
  getLoginQrCodeCreateAPI,
  getLoginQrCodeCheckAPI,
  LoginStatus,
} from "@/api/auth";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { defineStore } from "pinia";

const route = useRoute();
const router = useRouter();

interface UseLoginStore {
  unikey: string;
  qrMessage: string;
  qrCode: number | null;
  qrImg: string;
  qrCodeCheckInterval: NodeJS.Timer | null;
}

export const useLoginStore = defineStore("login", {
  state: (): UseLoginStore => {
    return {
      unikey: "",
      qrMessage: "",
      qrCode: null,
      qrImg: "",
      qrCodeCheckInterval: null,
    };
  },
  getters: {},
  actions: {
    async checkQrCodeStatus() {
      const { code, message, cookie } = (await getLoginQrCodeCheckAPI(
        this.unikey
      )) as LoginStatus;
      this.qrMessage = message;
      this.qrCode = code;

      if (this.qrCode === 803) {
        // 停止检测
        this.clearQrCodeCheckInterval();
        ElMessage({
          message: this.qrMessage,
          type: "success",
          duration: 3 * 1000,
        });
        window.localStorage.setItem("cookie", cookie);
        if (window.localStorage.getItem("cookie")) {
          const redirectUrl = route.query.redirect;
          router.push({ path: redirectUrl });
        }
      }
    },

    async getLoginQrCodeKey() {
      const { data } = await getLoginQrCodeKeyAPI();
      this.unikey = data.unikey;
      this.getLoginQrCodeCreate(this.unikey);
      // 开始定时检测
      this.qrCodeCheckInterval = setInterval(
        () => this.checkQrCodeStatus(),
        3000
      );
    },

    async getLoginQrCodeCreate(unikey: string) {
      const { data } = await getLoginQrCodeCreateAPI({
        key: unikey,
        qrimg: true,
      });
      this.qrImg = data.qrimg;
    },

    // 清除定时器
    clearQrCodeCheckInterval() {
      if (this.qrCodeCheckInterval) {
        clearInterval(this.qrCodeCheckInterval);
        this.qrCodeCheckInterval = null;
      }
    },
  },
  persist: true,
});
