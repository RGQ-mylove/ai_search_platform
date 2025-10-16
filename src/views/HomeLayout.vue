<template>
  <div class="home-page">
    <h1 class="page-title">
      文献检索系统
    </h1>
    
    <SearchInput
    @search="handleKeywordSearch"
    @clear="handleSearchClear"
    ref="searchInputRef"
    :default-value="SearchParams.keyword"
    />

    <!-- 筛选器 -->
    <SearchFilter
    @filter="handleFilterChange"
    ref="filterRef"
    :default-params="SearchParams"
    ></SearchFilter>


    <!-- 加载状态：显示骨架屏 -->
     <LoadingSkeleton v-if="isLoading"></LoadingSkeleton>

     <!-- 空状态：无检索结果的时候显示 -->
      <EmptyTip
      v-else-if="literatureStore.searchResults.total===0&&hasSearched"
      text="未找到相关文献，换个关键词试试"
      :icon="Search"
      btnText="重新检索"
      @btn-click="handleResetSearch"
      ></EmptyTip>

      <!-- 检索列表 -->

      <div class="result-list" v-else>
        <div class="result-item" v-for="item in literatureStore.searchResults.list" :key="item.id">
          <h3>{{ item.title }}</h3>
          <div class="middle">
            <img :src="item.cover" alt="">
            <p class="content">{{ item.content?.slice(0,100) }}...</p>
          
          </div>
          <p class="meta">作者:{{ item.author }} | 时间: {{ item.date }}</p>

        </div>
      </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import SearchInput from '../components/common/SearchInput.vue';
import LoadingSkeleton from '../components/common/LoadingSkeleton.vue';
import EmptyTip from '../components/common/EmptyTip.vue';
// 导入pinia
import { useLiteratureStore } from '../store/literatureStore';
import SearchFilter from '../components/common/SearchFilter.vue';
const literatureStore=useLiteratureStore()

const searchInputRef=ref(null)
const isLoading=ref(false) // 加载状态
// 如果没有触发过就不要显示没用检索结果
const hasSearched=ref(false) // 是否触发过检索
const filterRef=ref(null) // 获取searchFilter组件实例

const SearchParams=ref({
  keyword:'',  // 搜索关键词
  type:'',     // 文献类型
  startDate:'',// 开始日期
  endDate:''   // 结束日期
})


// 统一请求方法
const fetchSearchResult=async ()=>{
  // 避免空请求，至少有一个条件才请求
  const hasCondition=SearchParams.value.keyword?.trim() || SearchParams.value.type || SearchParams.value.startDate

  if(!hasCondition){
    ElMessage.warning('请输入关键词或选择筛选条件');
    return;
  }

  isLoading.value=true

  try {
    await literatureStore.getSearchResult(SearchParams.value)
  } catch (error) {
    literatureStore.clearSearchResult()
    
  }finally{
    // 更新状态
    isLoading.value=false
    hasSearched.value=true
  }

}
const handleKeywordSearch=(keyword)=>{
  SearchParams.value.keyword=keyword.trim()
  fetchSearchResult(SearchParams.value)
}

// 处理检索清空
const handleSearchClear=()=>{
  literatureStore.clearSearchResult()
  hasSearched.value=false
}

// 重新检索
const handleResetSearch=()=>{
  searchInputRef.value.setValue('') // 清空输出
  literatureStore.clearSearchResult()
  hasSearched.value=false
}

const handleFilterChange=(filterParams)=>{
  SearchParams.value={...SearchParams.value,...filterParams}
  fetchSearchResult()
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

.middle{
  display: flex;

  img{
    flex: 1;
    height: auto;
  }

  p{
    padding-left: 20px;
    width: 900px;
  }
  
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
