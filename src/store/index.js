import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // 这个是用来让vuex里面的值可以持久化保存的插件
import { getUserInfoAPI } from '@/api/index.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    UserInfo: {} // 保存用户信息(id,username,nickname,email,user_pic)
  },
  getters: {
    username: state => state.UserInfo.username, // 用户名
    nickname: state => state.UserInfo.nickname, // 用户昵称
    user_pic: state => state.UserInfo.user_pic // 用户头像
  },
  mutations: {
    updataToken(state, newToken) {
      state.token = newToken
    },
    updataUserInfo(store, res) {
      store.UserInfo = res
    }
  },
  actions: {
    async getUserInfoActions(store) {
      const { data: res } = await getUserInfoAPI()
      console.log(res)
      store.commit('updataUserInfo', res.data)
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState()// 注入持久化插件
  ]
})
