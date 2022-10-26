// 基于axios封装 网络请求的函数
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
// axios.create()创建一个带配置项的自定义axios函数
// MyAxios请求的时候 地址baseURL+url  然后再去请求后台
const MyAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 定义请求拦截器
// api里面每次调用request都会先走这个请求拦截器
MyAxios.interceptors.request.use(function(config) {
  // config配置对象(要请求后台的参数都在这个对象上面)
  // 在请求前会触发一次  这个return 交给axios源码内 根据配置项发起请求
  // console.log(config)
  // 在发起时 统一携带请求头Authorization和token值
  // 判断 登录页面和注册页面 vuex里面没有token 而且登录接口和注册接口也不需要携带token(其他页面需要)
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function(error) {
  // 请求发起前的代码 如果有异常报错 就会直接进入这里
  // 返回一个拒绝状态的Promise对象(axios留在原地的Promise对象状态就为失败结果为error变量值)
  // 此函数类似于 catch函数()里的return
  // 口诀:return非Promise对象值，会作为成功的结果 返回给下一个Promise对象(axios留在原地)
  // 口诀: returnPromise对象，这个Promise对象状态 返回给下一个Promise对象
  // Promise.reject()原地留下一个新的Promise对象(状态为失败) 它是Promise的类方法reject()
  return Promise.reject(error)
  // 等同于
  /**
   * return new Promise((resolve,reject) =>{
   * reject(error)
   * })
   */
})
// 定义响应拦截器
MyAxios.interceptors.response.use(function(response) {
  // 响应http状态码为2xx 或者3xx时触发成功的回调函数 形参中的 response是 "成功的结果"
  // return到axios原地Promise对象 作为成功的结果
  return response
}, function(error) {
  // 响应状态码为4xx,5xx时  触发失败的回调 新参中的 error时失败的结果
  // return到axios原地Promise对象位置，作为失败拒绝的状态 (如果那边用try+catch或者catch函数捕获 可以捕获到我们传递过去的这个error变量的值)
  if (error.response.status === 401) {
    store.commit('updataToken', '')
    store.commit('updataUserInfo', {})
    router.push('/login')
    Message.error('用户身份信息已过期')
  }
})

// 导出axios自定义函数
export default MyAxios
