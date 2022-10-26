import store from '@/store'
import request from '@/utils/request.js'

/**
 *
 * @param {*} param0 { username:用户名, password:密码, repassword:确认密码}
 * @returns promise
 */
export const getRequest = function ({ username, password, repassword }) {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 *
 * @param {*} param0 { username:用户名, password:密码}
 * @returns promise
 */
// 到处登录页面的验证
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    // method不写的话 默认就是get方法请求
    // 传参后给后台: params(查询字符串query)
    // data(请求体body),headers(请求头)
    headers: {
      // this.$store.state.token这里this不是组件对象不能使用this.$store拿到store对象
      Authorization: store.state.token
    }
  })
}
