import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
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

export default router
