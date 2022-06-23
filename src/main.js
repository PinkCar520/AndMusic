// 项目的入口文件
// 引入vue
import Vue from 'vue'
// 引入element-ui
import {
  Alert,
  Card,
  Message,
  Skeleton,
  SkeletonItem,
  Tabs,
  TabPane,
  Col,
  Result
} from "element-ui"
// 引入App组件 他是所有组件的父组件
import App from './App.vue'
// 引入router文件夹 路由
import router from './router'
// 引入store文件夹 状态管理
import store from './store'
// 引入normalize.css 样式重置
import 'normalize.css/normalize.css'
// 引入element-ui的css
import 'element-ui/lib/theme-chalk/index.css';
// 引入阿里矢量库定义的方法
import '@/utils/index'
// 引入插件
import plugins from './utils/plugins'
import NProgress from "nprogress"
import '@/assets/css/nprogress.css'
import BetterScroll from 'better-scroll'

// 使用plugins插件
Vue.use(plugins)
// 引入动画库
import 'vue2-animate/dist/vue2-animate.min.css'

// Vue-bus事件处理中心
const bus = new Vue()
Vue.prototype.$bus = bus;

Vue.use(Alert)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Col)
Vue.use(Result)
Vue.prototype.$message = Message
Vue.config.productionTip = false // 关闭vue的生产模式的提示
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });
// 创建vue实例
new Vue({
  router,
  store,
  // render: function (h) { return h(App) }
  render: h => h(App)
}).$mount('#app')