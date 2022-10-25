import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // 这个是用来让vuex里面的值可以持久化保存的插件
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  getters: {
  },
  mutations: {
    updataToken(state, newToken) {
      state.token = newToken
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState()// 注入持久化插件
  ]
})
