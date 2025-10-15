import request from './request'

/**
 * 收藏文献
 * @param {*} id
 * @returns
 */
export const addFavorite = (id) => {
  // 调用POST请求，对应后端的/api/favorite接口
  return request.post('/favorite', { id })
}

/**
 * 获取收藏列表
 * @returns {Promise}
 */
export const gPromiseetFavoriteList = () => {
  return request.get('/favorites')
}

/**
 * 移除收藏项
 * @param {*} id
 * @returns
 */
export const removeFavorite = (id) => {
  return request.delete(`/favorite/${id}`)
}
