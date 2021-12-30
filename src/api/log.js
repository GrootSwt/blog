import { getRequest, deleteRequest } from '@/plugins/request'

const ROOT_PATH = '/auditLog/'

// 条件分页查询日志
export function pageableSearchLog (data) {
  let url = `?page=${data.page - 1}&size=${data.size}`
  url += `&s_success=${data.searchForm.success}`
  if (data.searchForm.serviceName) {
    url += `&s_serviceName=${data.searchForm.serviceName}`
  }
  if (data.searchForm.loginName) {
    url += `&s_loginName=${data.searchForm.loginName}`
  }
  if (data.searchForm.dateRange.length === 2) {
    url += `&s_startDate=${data.searchForm.dateRange[0]}`
    url += `&s_endDate=${data.searchForm.dateRange[1]}`
  }
  return getRequest(ROOT_PATH + 'pageableSearch' + url)
}

// 批量删除日志
export function batchDeleteLog (idList) {
  return deleteRequest(ROOT_PATH + 'batchDelete?idArr=' + idList)
}
