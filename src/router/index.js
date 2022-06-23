import Vue from 'vue' // 引入vue
import VueRouter from 'vue-router' // 引入vue-router

Vue.use(VueRouter)

const routes = [{
    // 首页
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    // 发现
    path: '/discover',
    name: 'discover',
    component: () => import('@/views/Discover.vue')
  },
  {
    // 登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    // 我的
    path: '/login/user',
    name: 'user',
    component: () => import('@/views/User.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    // 排行榜
    path: '/playlist/:id',
    name: 'playlist',
    component: () => import('@/views/Playlist.vue')
  },
  {
    // 新碟上架
    path: '/album/:id',
    name: 'album',
    component: () => import('@/views/Album.vue')
  },
  {
    // 搜索页面
    path: '/search/:id',
    name: 'search',
    component: () => import('@/views/Search.vue'),
    meta: {
      title: '搜索',
      keepAlive: true
    }
  },
  {
    // 每日推荐页面
    path: '/daily/music',
    name: 'dailyMusic',
    component: () => import('@/views/DailyMusic.vue'),
  }
]
// 创建路由实例
const router = new VueRouter({
  mode: 'history', // 使用HTML5 的路由模式 history, hash模式带#
  routes
})
// 全局前置守卫-管理页面的跳转
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem('cookie')) {
      // 登录后放行
      next()
    } else {
      // 未登录跳转登录页面
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    // 其他页面放行
    next()
  }
})
// 暴露router为全局
export default router