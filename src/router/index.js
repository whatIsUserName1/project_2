import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  { path: '/', component: () => import('@/views/layout') },
  {
    path: '/reg', component: () => import('@/views/register/index.vue')
    // webpack提供import函数来路由懒加载导入
    // 路由懒加载 就是页面路由路径切换到/reg, 才去加载对应组件代码
    // 好处:让页面加载文件体积更新,打开更多
  },
  {
    path: '/login', component: () => import('@/views/login/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// 退出登录，重新登录，只走相关组件代码 相当于(异步dom切换 不会导致所有代码重新执行  app.vue不走)
// 效果不对：你换个账号得要重新请求用户数据
// 解决：
// 可以在登录页面 登录成功后再发起请求拿到用户信息
// 2.在全局前置路由守卫中 写路由跳转的时候 判断+获取
// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.UserInfo.username) {
    // 你现在本地有token值 才回去请求用户信息
    store.dispatch('getUserInfoActions')
  }
  next()
})
export default router
