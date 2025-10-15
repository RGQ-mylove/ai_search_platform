<template>
  <div class="home-page">
    <h1 class="page-title">
      文献检索系统
    </h1>

    <SearchInput
    @search="handleSearch"
    @clear="handleSearchClear"
    ref="searchInputRef"
    />

    <!-- 加载状态：显示骨架屏 -->
     <LoadingSkeleton v-if="isLoading"></LoadingSkeleton>

     <!-- 空状态：无检索结果的时候显示 -->
      <EmptyTip
      v-else-if="!searchResults.length&&hasSearched"
      text="未找到相关文献，换个关键词试试"
      :icon="Search"
      btnText="重新检索"
      @btn-click="handleResetSearch"
      ></EmptyTip>

      <!-- 检索列表 -->

      <div class="result-list" v-else>
        <div class="result-item" v-for="item in searchResults" :key="item.id">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content.slice(0,100) }}...</p>
          <p class="meta">作者:{{ item.author }} | 时间: {{ item.date }}</p>

        </div>
      </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { searchLiterature } from '../api/literature';
import SearchInput from '../components/common/SearchInput.vue';
import LoadingSkeleton from '../components/common/LoadingSkeleton.vue';
import EmptyTip from '../components/common/EmptyTip.vue';

const searchInputRef=ref(null)
const isLoading=ref(false) // 加载状态
const searchResults=ref([]) // 检索结果
// 如果没有触发过就不要显示没用检索结果
const hasSearched=ref(false) // 是否触发过检索


const handleSearch=async (keyword)=>{
  if(!keyword.trim()) return
  isLoading.value=true
  hasSearched.value=true

  try {
    const data=await searchLiterature(keyword,'')
    searchResults.value=data
    
    
  } catch (error) {
    searchResults.value=[]
    
  }finally{
    isLoading.value=false
  }

}

// 处理检索清空
const handleSearchClear=()=>{
  searchResults.value=[]
  hasSearched.value=false
}

// 重新检索
const handleResetSearch=()=>{
  searchInputRef.value.setValue('') // 清空输出
  searchResults.value=[]
  hasSearched.value=false
}

</script>
<style lang="less" scoped>
.home-page{
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title{
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.result-list{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item{
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.meta{
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
