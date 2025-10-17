<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import LoadingSkeleton from '../../components/common/LoadingSkeleton.vue';
import { User, Star, Clock, Setting } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useLiteratureStore } from '../../store/literatureStore';
import { useUserStore } from '../../store/userStore';
const navList=ref([
  { path: '/favorite', label: '我的收藏', icon: Star },
  { path: '/history', label: '检索历史', icon: Clock },
  { path: '/setting', label: '偏好设置', icon: Setting }
])

const route=useRoute()
const currentTitle=computed(()=>{
  const matchNav=navList.value.find(item=>`/user${item.path}`===route.path)
  return matchNav?matchNav.label:'个人中心'

})
const literatureStore=useLiteratureStore()
const userStore=useUserStore()
const historyCount=userStore.searchHistory.length


const favoriteCount=literatureStore.favoriteList.length
 

 onMounted(()=>{
  literatureStore.getFavoriteList()
 })
</script>

<template>
  <div class="user-center">
    <!-- 顶部用户信息栏 -->
     <div class="user-header">
      <div class="user-avatar">
        <el-avatar :size="56" icon="User"></el-avatar>
     
      </div>

      <div class="user-info">
        <h2 class="user-name">用户名</h2>
        <p class="user-desc">已收藏{{ favoriteCount }} 篇文献·检索历史 {{ historyCount }} 条</p>
      </div>
      </div>

      <!-- 主体内容-左侧导航+右侧内容 -->
       <div class="user-body">
        <div class="sidebar">
          <router-link
          v-for="item in navList"
          :key="item.path"
          :to="`/user${item.path}`"
          class="nav-item"
          :class="{active:$route.fullPath===`/user${item.path}`}"
          >

          
          <span class="nav-text">{{ item.label }}</span>

          </router-link>
        </div>

        <div class="content">
          <div class="content-header">
            <h3>{{currentTitle}}</h3>
          </div>
          <!-- 二级路由 -->
           <div class="content-wrapper">
            <LoadingSkeleton v-if="isLoading"></LoadingSkeleton>
            <router-view v-else></router-view>
           </div>
        </div>
       </div>
  </div>
</template>

<style lang="less" scoped>
a{
  text-decoration: none;
}

.user-center{
  max-width: 1200px;
  margin:0 auto;
  padding: 24px;
  font-family: 'Inter',sans-serif;
}

.user-header{
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f2f2f2;

  .user-info{
    .user-name{
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px;
    }

    .user-desc{
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }

  
}

.user-body{
  display: flex;
  gap: 32px;
  min-height: 600px;
}

.sidebar{
  display: flex;
  flex-direction: column;
  width: 220px;
  flex-shrink: 0;

  .nav-item{
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    color: #666;
    text-decoration: none;
    margin-bottom: 8px;
    transition: all 0.2s;

    .nav-text{
      font-size: 18px;
    }

    &:hover{
      background-color: #f8f9fa;
      color: #1890ff;
    }

    &.active{
      background-color: #e6f7ff;
      color: #1890ff;
      font-weight: 500;
    }

  }
}
</style>

