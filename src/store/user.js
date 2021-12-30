export default {
  namespaced: true,
  state: {
    // 用户信息
    loginUserInfo: {}
  },
  getters: {},
  mutations: {
    setLoginUserInfo (state, loginUserInfo) {
      state.loginUserInfo = loginUserInfo
    }
  },
  actions: {}
}
