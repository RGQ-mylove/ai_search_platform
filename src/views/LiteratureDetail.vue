<template>
    <div class="detail-container">

      <div class="btns">
        <el-button
      type="default"
      icon="ArrowLeft"
      @click="handleBack"
      class="back-btn"
      >
      返回搜索页

      </el-button>

      <!-- 收藏 -->
       <FavoriteBtn
       :id="route.params.id"
       v-if="route.params.id"
       class="favorite-btn"
       ></FavoriteBtn>

      </div>
        
        <!-- 加载状态 -->
         <LoadingSkeleton v-if="isLoading"></LoadingSkeleton>

         <!-- 详情页具体数据 -->
          <div class="detail-content" v-else-if="literature.id">
            <div class="detail-head">
                <h1 class="detail-title">
                    {{ literature.title }}
                </h1>

                <!-- 收藏按钮占位 -->
            </div>

            <!-- 元数据区 -->
             <div class="detail-meta">
                <span class="meta-item">作者：{{ literature.author }}</span>
                <span class="meta-item">来源：{{ literature.source }}</span>
                <span class="meta-item">类型：{{ literature.type }}</span>
                <span class="meta-item">发布日期：{{ literature.date }}</span>
             </div>

              <!-- 封面图 -->
        <div class="detail-cover">
        <el-image 
          :src="literature.cover" 
          alt="文献封面"
          fit="cover"
          lazy
        />
      </div>

       <!-- 完整内容 -->
      <div class="detail-full-content">
        <h3>摘要/内容：</h3>
        <p>{{ literature.content }}</p> <!-- 显示完整内容（不再截断） -->
      </div>

      




          </div>

          <!-- 3. 空状态：加载失败或无数据 -->
            <EmptyTip 
            v-else
            text="文献加载失败，请重试～"
            btnText="重新加载"
            @btn-click="fetchDetail"
            />

         

     

         
    </div>

     
</template>

<script setup>
import { onMounted, ref } from 'vue';
import LoadingSkeleton from '../components/common/LoadingSkeleton.vue';
import { getLiteratureDetail } from '../api/literature';
import { useRoute,useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import FavoriteBtn from '../components/literature/FavoriteBtn.vue';

const isLoading=ref(true)
// 存储详情页数据
const literature=ref({})
const route=useRoute()  // 获取当前路由实例
const router=useRouter() // 用于页面跳转

const fetchDetail=async ()=>{
    isLoading.value=true
    try {
        const literatureId=route.params.id
        
        const res=await getLiteratureDetail(literatureId)
        
        literature.value=res
        
    } catch (error) {
        console.error('加载失败',error);
        literature.value={}
        ElMessage.error('加载失败')
    }finally{
        isLoading.value=false
    }
}

onMounted(()=>{
    fetchDetail()
})

const handleBack=()=>{
    router.push('/') // 跳转回首页
}
</script>

<style lang="less">
.detail-container{
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    min-height: 100vh;
}

.detail-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.detail-meta{
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    color: #666;
    font-size: 14px;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;

}

.detail-cover{
    width: 100%;
    height: auto;
    margin-bottom: 24px;
    border-radius: 8px;
    overflow: hidden;

    .el-image {
    width: 100%;
    height: 100%;
  }
}



.detail-full-content {
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.detail-full-content h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #444;
}

.back-btn {
  margin-top: 32px;
}

.btns{
  display: flex;
  justify-content: space-between;
}

.favorite-btn{
  margin-top: 32px;

}

</style>