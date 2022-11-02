import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUi/index.js' // 让elmentUI注册的代码参与打包  才能再页面上运行并注册组件
import '@/Vue-Quill-Editor' // 导入富文本编辑器
import dayjs from 'dayjs' // 导入dayjs格式化时间用的
// 基于dayjs封装一个全局函数来格式化时间(任意的组件可以直接使用$formatDate)
Vue.prototype.$formatDate = (dayObj) => {
  // 结组dayjs内置的方法把日期对象格式花成指定的格式,并把格式化好的字符串返回到调用处
  return dayjs(dayObj).format('YYYY-MM-DD HH:mm:ss')
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 后端返回图片链接地址的经验
// 为何后端返回的图片是半截的?
// 原因: 因为服务器的域名可能会来回变化 所以数据里的地址只有相对路径
// 要求:前端请求此图片的时候 后端告诉你图片文件真身所在的服务器域名 前端自己拼接前缀

// 积累知识
// 组件创建时 会用date里面的默认值 让template里标签先渲染一次
// 你的网络请求数据回来data里变量发生了改变，会让template里使用此变量的地方再次更新dom
// 小问题: 第一次渲染的时候没有值 可能会导致一些报错 但是效果还是出来了
// 解决: v-if先不让template里会报错的那个代码执行  会先屏蔽掉
// 解决2: 可以给那个对象的属性一个空字符串 别让报错就行
