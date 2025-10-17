<template>
  <div class="home-page">
    <h1 class="page-title">
      文献检索系统
    </h1>
    
    <SearchInput
    v-model="SearchParams.keyword"
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

      <VirtualList
      v-else-if="literatureStore.searchResults.total > 0"
      :data="literatureStore.searchResults.list"
      keyField="id"                              
      :config="virtualConfig" 
      >

      <!-- 插槽：自定义每条文献的渲染样式（和原来的literature-item一致） -->
      <template #default="{ item }">  <!-- item是虚拟列表组件传过来的单条数据 -->

        <RouterLink
        :to="`/literature/${item.id}`"

        class="card-link"
        >

          <el-card class="literature-card" >
              <div class="literature-cover">
                <el-image :src="item.cover" lazy fit="cover"></el-image>
              </div>
              <div class="literature-info">
                <h3 class="literature-title">{{ item.title }}</h3>
                <p class="literature-desc">{{ item.content.slice(0, 120) }}...</p>
                <p class="literature-meta">作者: {{ item.author }} | 时间: {{ item.date }}</p>
              </div>
          </el-card>

        </RouterLink>
       
      </template>
    
    </VirtualList>

      
      

  </div>
</template>

<script setup>
import { computed, onMounted, ref ,watch} from 'vue';
import SearchInput from '../components/common/SearchInput.vue';
import LoadingSkeleton from '../components/common/LoadingSkeleton.vue';
import EmptyTip from '../components/common/EmptyTip.vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';
// 导入pinia
import { useLiteratureStore } from '../store/literatureStore';
import { useUserStore } from '../store/userStore';
import SearchFilter from '../components/common/SearchFilter.vue';
import VirtualList from '../components/common/VirtualList.vue';
// 导入vueuse

const literatureStore=useLiteratureStore()

const route=useRoute()
const searchInputRef=ref(null)
const isLoading=ref(false) // 加载状态
// 如果没有触发过就不要显示没用检索结果
const hasSearched=ref(false) // 是否触发过检索
const filterRef=ref(null) // 获取searchFilter组件实例

const userStore=useUserStore()
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
// 处理输入的关键字
const handleKeywordSearch=(keyword)=>{
  SearchParams.value.keyword=keyword.trim()
  fetchSearchResult(SearchParams.value)
  userStore.addSearchHistory(keyword)
}

// 处理检索清空
const handleSearchClear=()=>{
  literatureStore.clearSearchResult()
  hasSearched.value=false
}

// 重新检索
const handleResetSearch=()=>{
  SearchParams.value.keyword='' // 清空输出
  literatureStore.clearSearchResult()
  hasSearched.value=false
}

const handleFilterChange=(filterParams)=>{
  SearchParams.value={...SearchParams.value,...filterParams}
  fetchSearchResult()
}


// ---------------------- 新增：虚拟列表配置 ----------------------
const virtualConfig = ref({
  itemHeight: 220,  // 单条文献高度（和组件默认值一致，可调整）
  overscan: 5,      // 缓冲区（保持默认）
  listHeight: 'calc(100vh - 240px)'  // 列表容器高度（适配页面布局）
});


watch(
  ()=>SearchParams.value.keyword,
  (newKeyword)=>{
    
    if(newKeyword){
      SearchParams.value.keyword=newKeyword
      fetchSearchResult();
    }
  }
)

onMounted(()=>{
  
  
  
  const keyword=route.query.keyword
  
  if(keyword){
    SearchParams.value.keyword=keyword

    
    
  }
})

</script>
<style lang="less" scoped>
.home-page{
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.page-title{
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}


.card-link{
  text-decoration: none;
  color: inherit;
  display: block;
}
.literature-item {
  display: flex; /* 关键：让内部 el-card 占满父容器 */
  margin-bottom: 16px; /* 卡片之间的间距 */
  box-sizing: border-box;
}

.literature-card{
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-sizing: border-box;
  height: 220px !important;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  ::v-deep .el-card__body {
    display: flex !important;
    align-items: center;
    gap: 16px;
    padding: 16px; // 把原计划给 el-card 的 padding 移到这里，保持内边距效果
    width: 100%; // 确保 body 占满 el-card 宽度
    box-sizing: border-box;
  }
}

.literature-cover {
  width: 120px;
  height: auto;
  flex-shrink: 0; /* 固定宽度，不收缩 */

}

.literature-info {
  flex: 1; /* 占满剩余宽度 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 8. 文献标题：控制换行和溢出 */
.literature-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap; /* 不换行（避免标题过长导致卡片高度变化） */
  overflow: hidden;
  text-overflow: ellipsis; /* 溢出显示省略号（...） */
}

/* 9. 文献描述：控制多行溢出 */
.literature-desc {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5; /* 行高，增强可读性 */
  /* 最多显示4行，超出省略（避免描述过长撑高卡片） */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 10. 文献元数据（作者/时间）：弱化样式，区分主次 */
.literature-meta {
  margin: 0;
  font-size: 12px;
  color: #999; /* 浅灰色，降低视觉权重 */
  margin-top: auto; /* 顶到信息区底部（确保元数据始终在卡片底部，布局更稳定） */
}

</style>
