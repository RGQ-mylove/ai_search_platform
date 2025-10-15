import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia' // 替代 Vuex
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'

// 创建 Vue 应用
const app = createApp(App)

// 使用 Pinia（替代 Vuex）
const pinia = createPinia()
app.use(pinia)

// 使用 Vue Router 4
app.use(router)

// 使用 Element Plus
app.use(ElementPlus)

// 全局注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


// 全局挂载 Axios 和 API 基础路径
app.config.globalProperties.$axios = axios
app.config.globalProperties.$baseApi = import.meta.env.VITE_BASE_API // Vue 3 使用 Vite 环境变量

// 关闭生产环境提示
app.config.productionTip = false

// 挂载应用
app.mount('#app')
