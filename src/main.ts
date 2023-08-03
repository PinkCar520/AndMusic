import { createApp } from "vue";
import router from "./router/index";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import NProgress from "nprogress"; // 引入NProgress
import "@/assets/styles/nprogress.css";
import { ElMessage } from "element-plus";
import svgIcon from "./components/SvgIcon.vue";
import "virtual:svg-icons-register";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(ElMessage);
pinia.use(piniaPluginPersistedstate);
app.component("SvgIcon", svgIcon);
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });
app.mount("#app");
