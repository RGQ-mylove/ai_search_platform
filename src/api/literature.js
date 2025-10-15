import request from './request'

/**
 *检索文献
 * @param {*} keyword
 * @param {*} type
 * @returns {Promise}
 */
export const searchLiterature = (keyword, type) => {
  // 构建查询参数
  const params = { keyword }
  if (type) {
    params.type = type
  }

  return request.get('/api/search', { params })
}

/**
 * 获取文献详情
 * @param {*} id
 * @returns
 */
export const getLiteratureDetail = (id) => {
  return request.get(`/api/document/${id}`)
}
