import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建一个基础的axios,添加拦截器，请求拦截器主要实现了身份验证，响应拦截器主要给用户提示当前错误
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时时间
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器：添加Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    // 如果Token存在，则添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    // 请求错误处理
    ElMessage.error('请求参数错误')
    return Promise.reject(err)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功响应处理
    const res = response.data

    // if后端返回200状态码
    if (res.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.message || '操作失败')
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  (error) => {
    // 网络错误处理
    if (error.message.includes('timeout')) {
      ElMessage.error('请求超时，请稍后尝试')
    } else if (error.response) {
      switch (error.response) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求错误: ${error.response.status}`)
      }
    } else {
      ElMessage.error('网络连接错误，重新连接')
    }
    return Promise.reject(error)
  }
)

export default request
