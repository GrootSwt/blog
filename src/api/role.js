import { deleteRequest, getRequest, postRequest, putRequest } from '@/plugins/request'

const ROOT_PATH = '/role/'

// 条件分页查询菜单列表
export function pageableSearchMenu (data) {
  let url = ROOT_PATH + `pageableSearch?page=${data.page - 1}&size = ${data.size}`
  if (data.searchName) {
    url += `&s_name=${data.searchName}`
  }
  return getRequest(url)
}

// 保存角色
export function saveRole (data) {
  return postRequest(ROOT_PATH + 'saveRole', data)
}

// 为角色分配权限
export function assignPermissions (data) {
  return putRequest(ROOT_PATH + `${data.assignRoleId}/assignPermissions`, data.checkedKeys)
}

// 根据角色id获取权限树
export function getMenuIdArrByRoleId (data) {
  return getRequest(ROOT_PATH + `${data.id}/getMenuIdArrByRoleId`)
}

// 批量删除角色
export function batchDeleteByIds (data) {
  return deleteRequest(ROOT_PATH + `batchDeleteByIds?ids=${data.ids}`)
}

// 更改角色启用状态
export function changeRoleEnabled (data) {
  return putRequest(ROOT_PATH + 'changeRoleEnabled', data)
}

// 获取角色列表
export function getAllRoleList () {
  return getRequest(ROOT_PATH + 'getAllRoleList')
}

// 判断角色名是否已经存在
export function roleNameIsExist (roleName) {
  return getRequest(ROOT_PATH + `${roleName}/roleNameIsExist`)
}
