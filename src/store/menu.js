import { getAuthorities, getMenuTree } from '@/api/menu'

export default {
  namespaced: true,
  state: {
    // 菜单列表
    menuList: [],
    // 权限信息
    authority: []
  },
  getters: {
    getAuthorities: state => {
      return state.authority
    }
  },
  mutations: {
    setMenuList (state, menu) {
      state.menuList = menu
    },
    setAuthority (state, authority) {
      state.authority = authority
    }
  },
  actions: {
    async getMenuList ({
      commit,
      rootState
    }) {
      const res = await getMenuTree({
        roleId: rootState.user.loginUserInfo.roleId
      })
      if (res.status === 'success') {
        commit('setMenuList', res.data)
        const res2 = await getAuthorities({
          roleId: rootState.user.loginUserInfo.roleId
        })
        if (res2.status === 'success') {
          commit('setAuthority', res2.data)
        }
      }
    }
  }
}
