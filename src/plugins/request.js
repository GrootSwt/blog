import axios from 'axios'
import router from '@/router/index'
import { Message } from 'element-ui'

const instance = axios.create({
  baseURL: '/api'
})
//  请求拦截器
instance.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
//  响应拦截器
instance.interceptors.response.use(response => {
  if (response.data.status === 'unauthorized') {
    Message.error(response.data.message)
    return router.push({
      path: '/login',
      query: {
        redirect: router.history.current.path
      }
    })
  }
  return response
}, error => {
  responseErrorHandler(error)
  return Promise.reject(error)
})

// 处理异常信息
function responseErrorHandler (error) {
  switch (error.response.status) {
    case 401:
      Message.error('登录信息已过期，请重新登录！')
      router.push({
        path: '/login',
        query: {
          redirect: router.history.current.path
        }
      })
      break
    case 403:
      Message.error('登录信息已过期，请重新登录！')
      router.push({
        path: '/login',
        query: {
          redirect: router.history.current.path
        }
      })
      break
    case 404:
      Message.error('服务不可用！')
      break
    case 503:
      Message.error('服务不可用！')
      break
  }
}

// get请求，可以将参数放在路径，也可以将参数放入data中
export function getRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
      params: data
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// post请求
export function postRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// put请求
export function putRequest (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.put(url, data).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// delete请求
export function deleteRequest (url, data = {}) {
  return new Promise((resolve, reject) => [
    instance.delete(url, {
      params: data
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  ])
}

export default instance
