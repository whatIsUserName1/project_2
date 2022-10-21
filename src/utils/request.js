// 基于axios封装 网络请求的函数
import axios from 'axios'
// axios.create()创建一个带配置项的自定义axios函数
// MyAxios请求的时候 地址baseURL+url  然后再去请求后台
const MyAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})
// 导出axios自定义函数
export default MyAxios
