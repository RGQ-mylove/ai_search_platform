<template>
  <div class="history-list-container">
    <!-- 头部：标题+清空按钮 -->
     <div class="history-header">
      <h3>检索历史</h3>
      <el-button
      type="text"
      color="#f56c6c"
      @click="handleClearHistory"
      v-if="userStore.searchHistory.length>0"
      >
      清空历史

      </el-button>
     </div>

     

     <!-- 空状态 -->

     <EmptyTip 
        v-if="userStore.searchHistory.length===0"
        text="暂无检索历史,快去检索吧"
        btnText="去检索"
        @btn-click="goToSearch"
      />

      <!-- 检索历史 -->
       <el-list
       v-else
       border
       class="history-list"
       :data="userStore.searchHistory"
       >

       <el-list-item
       v-for="(keyword,index) in userStore.searchHistory"
       :key="index"
       class="history-item"
       @click="handleReSearch(keyword)"
       >

       <!-- 历史关键字 -->
        <div class="history-keyword">
          <el-icon class="icon" size="16"><Search /></el-icon>
          <span>{{ keyword }}</span>
        </div>

        <!-- 右侧“重新检索”按钮（hover显示） -->
        <el-button 
          type="text" 
          size="small" 
          class="re-search-btn"
          @click.stop="handleReSearch(keyword)" 
        >
          重新检索
        </el-button>

       </el-list-item>


       </el-list>
     
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import EmptyTip from '../../components/common/EmptyTip.vue';

import { useUserStore } from '../../store/userStore';
import { useLiteratureStore } from '../../store/literatureStore';
import { Search } from '@element-plus/icons-vue';
import { useRoute,useRouter } from 'vue-router';
const userStore=useUserStore()
const literatureStore=useLiteratureStore()
const route=useRoute()
const router=useRouter()

const handleClearHistory=()=>{
   userStore.clearHistory()
   ElMessage('检索历史已清空')
}


// 点击重新检索,携带关键词跳转到检索页

const handleReSearch=(keyword)=>{
  
  router.push({
    path:'/',
    query:{keyword:keyword}
    
  })

}

const goToSearch=()=>{
  router.push('/')
}

</script>

<style scoped lang="less">
.history-list-container{
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 120px);
}

.history-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3{
    font-size: 18px;
    color: #333;
    font-weight: 500;
  }
}

.history-item{
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.2s;
}

.history-item:hover{
  background-color: #f5f7fa;
}

.history-keyword .icon{
  color: #999;
  margin-right: 15px;
}

/* 重新检索按钮：默认隐藏，hover显示 */
.re-search-btn {
  color: #409eff;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .re-search-btn {
  opacity: 1;
}


</style>
