import { getRequest, postRequest } from '@/plugins/request'
import { getCookie } from '@/utils/util'

// 登录
export function login (data) {
  return postRequest('/login', data)
}

// 登出
export function logout () {
  const token = getCookie('token')
  return getRequest(`${token}/logout`)
}
