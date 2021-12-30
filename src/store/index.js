import Vue from 'vue'
import Vuex from 'vuex'
import menu from '@/store/menu'
import user from '@/store/user'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    menu,
    user
  }
})
