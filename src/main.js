import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUi/index.js' // 让elmentUI注册的代码参与打包  才能再页面上运行并注册组件
import '@/Vue-Quill-Editor' // 导入富文本编辑器
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
