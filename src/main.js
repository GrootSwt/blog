import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 全局引入echarts
import * as echarts from 'echarts'
// 引入二次封装的四种请求
import { getRequest, postRequest, putRequest, deleteRequest } from '@/plugins/request'
// 引入图标选择器
import eIconPicker from 'e-icon-picker'
// 基本彩色图标库
import 'e-icon-picker/lib/symbol.js'
// 基本样式，包含基本图标
import 'e-icon-picker/lib/index.css'
// font-awesome 图标库
import 'font-awesome/css/font-awesome.min.css'
// element-ui 图标库
import 'element-ui/lib/theme-chalk/icon.css'
// 引入权限判断方法
import isAuth from './utils/authority'
// 使用图标选择器
Vue.use(eIconPicker, {
  FontAwesome: true,
  ElementUI: true,
  eIcon: true,
  eIconSymbol: true
})

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts

// axios经过Promise二次封装后的四个请求放入到Vue的prototype上
Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
// 权限校验
Vue.prototype.isAuth = isAuth
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
