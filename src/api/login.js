import { getRequest, postRequest } from '@/plugins/request'

// 登录
export function login (data) {
  return postRequest('/login', data)
}

// 登出
export function logout () {
  return getRequest('/logout')
}
