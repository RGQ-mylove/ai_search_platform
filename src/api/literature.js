import request from './request'

/**
 *检索文献
 * @param {*} keyword
 * @param {*} type
 * @returns {Promise}
 */
export const searchLiterature = (params) => {
  
  return request.get('/api/search', { params })
}

/**
 * 获取联想
 * @param {*} keyword 
 * @returns 
 */
export const getAISuggest=async(keyword)=>{
  try {
   
    
    const response=await request.get('/api/ai/suggest',{
      params:{keyword:keyword.trim()}

    })
    
    

    
    // 校验接口返回格式
    if(response){
      
      return response.suggestList || []
    }else{
      console.warn('联想接口返回格式异常',response.data);
      return []
      
    }
    
  } catch (error) {
    console.error('获取联想词失败:', error.message);
    return []; // 出错时返回空数组，避免前端崩溃
    
  }
}

/**
 * 获取文献详情
 * @param {*} id
 * @returns
 */
export const getLiteratureDetail = (id) => {
  
  
  return request.get(`/api/document/${id}`)
}
