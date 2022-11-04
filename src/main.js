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

// 打包相关问题:
// 问题:打开index.html,出现了404问题
// 原因：
// 1.默认打包，index.html引入其他打包的文件使用的是绝对地址
// 地址是以/开头(要找到当前index.html打开时所在服务器的根地址(文件夹))
// 就得确保你的vscode+liserver插件打开时，vscode根目录得直接是dist文件夹
// 你如果把dist文件夹交给后台运维工程师部署到服务器上 dist下内容就得在服务器根目录才行
// 但是服务器一般会有多个项目 不让你用根目录直接放一个项目，很乱
// 解决:webpack让你写一个配置项pulicPath(控制index.html引入其他资源前缀地址)
// vueConfig.config.js(脚手架配置文件,webpack配置文件)
// publicPack:默认值 '/' 确保开发环境下,是这个值,因为开发服务器会把所有打包在内存里而且作为服务器的根目录文件夹，绝对地址
// 圣餐环境准备上线了,这个时候，旧的用相对地址,publicPath:'./'
// 路径不以/开头其实就是./开头(默认的)
