import request from '@/utils/request.js'

/**
 * 注册页面的提交请求
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

// 获取用户信息
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
    // method不写的话 默认就是get方法请求
    // 传参后给后台: params(查询字符串query)
    // data(请求体body),headers(请求头)
    // headers: {
    //   // this.$store.state.token这里this不是组件对象不能使用this.$store拿到store对象
    //   Authorization: store.state.token
    // }
  })
}

// 获取侧边栏数据
export const getMenysListAPI = () => {
  return request({
    url: '/my/menus'
  })
}
/**
 * 更新-基本资料
 * @param {*} param0
 * @returns
 */
export const updataUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 *  修改头像
 */
export const updataUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}
/**
 *跟新用户密码 返回的是一个 promise对象
 */
export const updataPwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取文章分类
 * @returns promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加-文章分类
 * @param{*}param0{cate_name:分类名,cate_alias:分类别名}
 * @returns promise对象
 */
export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 修改文章 分类内容
 * @param {*} param0 {id:文章分类id,cate_name:文章分类名字,cate_alias:文章分类别名}
 * @returns Promise对象
 */

export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id, cate_name, cate_alias
    }
  })
}
