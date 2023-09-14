import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import auth from "@/utils/auth";
const Home = () => import("@/pages/Home.vue");
const NavBar = () => import("@/components/NavBar/NavBar.vue");
const Discover = () => import("@/pages/Discover.vue");
const Login = () => import("@/pages/Login.vue");
const User = () => import("@/pages/User.vue");
const Playlist = () => import("@/pages/Playlist.vue");
const Album = () => import("@/pages/Album.vue");
const Search = () => import("@/pages/Search.vue");
const DailyMusic = () => import("@/pages/DailyMusic.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home", // 1. params 的自动编码/解码 2.没有硬编码的 URL 3.绕过路径排序
    // alias: "/main", // 别名
    component: Home,
  },
  {
    path: "/",
    name: "navbar",
    component: NavBar,
  },

  {
    // 发现
    path: "/discover",
    name: "discover",
    component: Discover,
  },
  {
    // 登录
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    // 我的
    path: "/login/user",
    name: "user",
    component: User,
    // 路由元信息
    meta: {
      requiresAuth: true,
    },
  },
  {
    // 排行榜
    path: "/playlist/:songListId",
    name: "playlist",
    component: Playlist,
    // 路由组件props传参_布尔形式
    props: true,
    meta: {
      keepAlive: true,
    },
  },
  {
    // 新碟上架
    path: "/album/:songListId", // 动态路由
    name: "album",
    component: Album,
    // 路由组件props传参_函数形式
    props: (route) => ({ songListId: route.params.songListId }),
  },
  {
    // 搜索页面
    path: "/search/:songListId",
    name: "search",
    component: Search,
    meta: {
      title: "搜索",
      keepAlive: true,
    },
  },
  {
    // 每日推荐页面
    path: "/daily/music",
    name: "dailyMusic",
    component: DailyMusic,
    meta: {
      requiresAuth: true,
    },
  },
];
const router = createRouter({
  // 指定路由模式 默认使用的是 Hash 模式,在 URL 中使用哈希字符（#）
  // 不需要服务器配置，但在 SEO 上不太友好
  // HTML5 模式 需要服务器配置支持  SEO 友好
  history: createWebHistory(),
  //   路由地址
  routes,
  scrollBehavior(to, from, savePosttion) {
    return {
      top: 0,
    };
  },
});
// 全局前置守卫-管理页面的跳转
// to 即将要进入的目标
// from 即将要离开的目标
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth && !(await auth())) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});
export default router;

// 全局解析守卫
// router.beforeResolve(async (to, from, next) => {
//   // 在路由切换前执行一些逻辑，例如获取数据、验证权限等
//   console.log("Global beforeResolve guard");
//   next(); // 必须调用 next()，否则导航将不会继续
// });
// // 全局后置钩子 不会接受 next 函数也不会改变导航本身
// router.afterEach((to, from) => {
//   // 在导航被确认之后执行一些逻辑，例如记录日志等
//   console.log("Global afterEach guard");
// });
