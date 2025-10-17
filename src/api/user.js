import request from './request'

/**
 * 收藏文献
 * @param {*} id
 * @returns
 */
export const addFavorites = (id) => {
  // 调用POST请求，对应后端的/api/favorite接口
  return request.post('/api/favorite', { id })
}

/**
 * 获取收藏列表
 * @returns {Promise}
 */
export const getFavoriteListApi = () => {
  return request.get('/api/favorites')
}

/**
 * 移除收藏项
 * @param {*} id
 * @returns
 */
export const removeFavoriteApi = (id) => {
  
  return request.delete(`/api/favorite/${id}`)
}
