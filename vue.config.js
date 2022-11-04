const { defineConfig } = require('@vue/cli-service')
// 需要配置的CDN链接
let CDN = { css: [], js: [] }
// 需要排除的包，对象
let externals = {}
// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
  externals = {
    // 基本表格:
    // '包名':'在项目中引入的名字'
    axios: 'axios',
    dayjs: 'dayjs',
    echarts: 'echarts',
    'element-ui': 'ELEMENT',
    vue: 'Vue',
    'vue-quill-editor': 'VueQuillEditor',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    'vuex-persistedstate': 'createPersistedState'
  }
  CDN = {
    css: [ // element-ui css样式表
      'https://unpkg.com/element-ui@2.15.10/lib/theme-chalk/index.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.bubble.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.core.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.snow.css'
    ],
    js: [
      'https://unpkg.com/axios@1.1.3/dist/axios.min.js',
      'https://unpkg.com/dayjs@1.11.6/dayjs.min.js',
      'https://unpkg.com/echarts@5.4.0/dist/echarts.js',
      'https://unpkg.com/vue@2.6.14/dist/vue.js',
      'https://unpkg.com/vue-quill-editor@3.0.6/dist/vue-quill-editor.js',
      'https://unpkg.com/vue-router@3.5.1/dist/vue-router.js',
      'https://unpkg.com/vuex@3.6.2/dist/vuex.js',
      'https://unpkg.com/vuex-persistedstate@3.2.1/dist/vuex-persistedstate.umd.js',
      'https://unpkg.com/element-ui@2.15.10/lib/index.js'
    ]
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: './'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    externals: externals
  },
  chainWebpack (config) {
    // 注入cdn变量(打包时会执行)
    config.plugin('html').tap(args => {
      args[0].cdn = CDN // 配置CDN插件
      return args
    })
  }
})
// 影响打包时,index.html引入其他资源的前缀地址
// ./可以让开发环境和生产环境都可以正常使用
// 为了严谨一些
// 开发环境'/'
// 生产环境:'./'

// 问题:有无代码可以让他自己识别当前运行环境?
// node里有个内置的环境变量process.env.NODE_ENV
// process.env.NODE_ENV 它会根据你敲击的命令，来使用不同的值
// 解决:
// 如果你敲击 npm serve,process.env.NODE_ENV的值就是'development'字符串
// 如果你敲击 npm build,process.env.NODE_ENV的值就是'production'字符串

// 总结:
// 1.publicPath:影响的是打包(webpack开发服务器/dist)的时候index.html引入其他资源的前缀地址
// 情况1:开发环境，值：'/'
// 情况1:生产环境，值：'./'(才能确保dist、index.html相对路径下访问)

// 2.dist瘦身:影响dist的体积,其他第三方包用cdn地址引入到index.html中保证运行
// 情况1:开发环境
// (1):externals无值(不排除第三方包)
// (2):index.html里不引入cnd地址
// 情况2:生产环境
// (1):externals有值(排除第三方包)
// (2):index.html里引入cnd地址
