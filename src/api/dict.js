import { deleteRequest, getRequest, postRequest, putRequest } from '@/plugins/request'

const DICTIONARY_CATEGORY_ROOT_PATH = '/dictionaryCategory/'
const DICTIONARY_ROOT_PATH = '/dictionary/'

// 分页条件查询数据字典类别
export function pageableSearchDictionaryCategory (data) {
  let url = DICTIONARY_CATEGORY_ROOT_PATH + `pageableSearch?page=${data.page - 1}&size=${data.size}`
  if (data.searchForm.categoryName) {
    url += `&s_categoryName=${data.searchForm.categoryName}`
  }
  if (data.searchForm.dateRange && data.searchForm.dateRange.length === 2) {
    url += `&s_startDate=${data.searchForm.dateRange[0]}`
    url += `&s_endDate=${data.searchForm.dateRange[1]}`
  }
  if (data.searchForm.enabled) {
    url += `&s_enabled=${data.searchForm.enabled}`
  }
  return getRequest(url)
}

// 保存数据字典类别
export function saveDictionaryCategory (data) {
  return postRequest(DICTIONARY_CATEGORY_ROOT_PATH + 'save', data)
}

// 批量删除数据字典类别
export function batchDeleteDictionaryCategory (idArr) {
  return deleteRequest(DICTIONARY_CATEGORY_ROOT_PATH + `batchDelete?idArr=${idArr}`)
}

// 更改数据字典类别启用状态
export function changeDictionaryCategoryEnabled (data) {
  return putRequest(DICTIONARY_CATEGORY_ROOT_PATH + 'modifyEnabled', data)
}

// 分页条件查询数据字典
export function pageableSearchDictionary (data) {
  let url = DICTIONARY_ROOT_PATH + `pageableSearch?page=${data.page - 1}&size=${data.size}`
  if (data.searchForm.categoryId) {
    url += `&s_categoryId=${data.searchForm.categoryId}`
  }
  if (data.searchForm.dictionaryKey) {
    url += `&s_dictionaryKey=${data.searchForm.dictionaryKey}`
  }
  if (data.searchForm.dateRange && data.searchForm.dateRange.length === 2) {
    url += `&s_startDate=${data.searchForm.dateRange[0]}`
    url += `&s_endDate=${data.searchForm.dateRange[1]}`
  }
  if (data.searchForm.enabled) {
    url += `&s_enabled=${data.searchForm.enabled}`
  }
  return getRequest(url)
}

export function saveDictionary (data) {
  return postRequest(DICTIONARY_ROOT_PATH + 'save', data)
}

export function batchDeleteDictionary (idArr) {
  return deleteRequest(DICTIONARY_ROOT_PATH + `batchDelete?idArr=${idArr}`)
}

export function changeDictionaryEnabled (data) {
  return putRequest(DICTIONARY_ROOT_PATH + 'modifyEnabled', data)
}
