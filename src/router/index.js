import { createRouter, createWebHistory } from 'vue-router'




const routes = [
  {
    path: '/',
    name: 'HomeLayout',
    component: () => import('@/views/HomeLayout.vue'),
    meta: { title: '文献检索首页' }
  },
  {
    path: '/literature/:id',
    name: 'LiteratureDetail',
    component: () => import('@/views/LiteratureDetail.vue'),
    meta: { title: '文献详情页' }
  },
  {
    path: '/login',
    name: 'LoginLayout',
    component: () => import('@/views/LoginLayout.vue'),
    meta: { title: '登录页' }
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/views/user/UserCenter.vue'),
    meta: {
      title: '个人中心',
      // requiresAuth: true // 标记为需要登录
    },
    beforeEnter:(to,from,next)=>{
      console.log('我来啦');
      next()
      
    },
    children: [
      {
        path: 'history',
        name:'UserHistory',
        component: () => import('@/views/user/UserHistory.vue'),
        meta: { title: '浏览历史' }
      },
      {
        path: 'favorite',
        name: 'UserFavorite',
        component: () => import('@/views/user/UserFavorite.vue'),
        meta: { title: '我的收藏' }
      },
      {
        path: 'setting',
        name: 'UserSetting',
        component: () => import('@/views/user/UserSetting.vue'),
        meta: { title: '偏好设置' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫（逻辑不变）
router.beforeEach((to, from, next) => {
  // 动态设置页面标题
  document.title = to.meta.title || '文献检索系统'

  // 检查路由是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      next() // 已登录，放行
    } else {
      // 未登录，跳转到登录页并携带重定向路径
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next() // 不需要登录，直接放行
  }
})

export default router