import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd.vue')
      },
      // 文章列表
      {
        path: 'art-cate',
        component: () => import('@/views/article/article.vue')
      }
    ],
    redirect: '/home'
  },
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

const whiteList = ['/login', '/reg']
// 退出登录，重新登录，只走相关组件代码 相当于(异步dom切换 不会导致所有代码重新执行  app.vue不走)
// 效果不对：你换个账号得要重新请求用户数据
// 解决：
// 可以在登录页面 登录成功后再发起请求拿到用户信息
// 2.在全局前置路由守卫中 写路由跳转的时候 判断+获取
// 全局前置路由守卫
// 知识点1: 浏览器第一次打开项目页面会触发一次 全局路由守卫函数
// 知识点2: 判断登录与否:有token就证明登录了 没有token就没有登录
// 知识点3:next()如果强制切换路由地址 会再次走路由守卫再次去匹配路由表
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 登录了
    if (!store.state.UserInfo.username) {
      // 你现在本地有token值 才回去请求用户信息
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组.includes(值) 作用 判断值是否在数组中出现过  出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录 可以访问的路由地址，则放行(路由全局前置守卫不会再次触发了)，而是匹配路由表，让组件挂载
      next()
    } else {
      // next()强制切换到登录路径上
      next('/login')
    }
  }
})
export default router
