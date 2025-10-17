<template>
    <div class="favorite-page-container">

        <EmptyTip
        v-if="literatureStore.favoriteList.length === 0"
        text="暂无收藏文献，遇到感兴趣的文献就收藏起来吧"
        btnText="去检索文献"
        @btn-click="goToSearch"
        />

        <div class="favorite-list" v-else>

            <el-card
            v-for="(item, index) in literatureStore.favoriteList"
             :key="item.id || index"
             class="favorite-card"
            >
            <!-- 文献标题+取消收藏 -->
             <div class="card-head">
                <h3>{{ item.title }}</h3>

                <FavoriteBtn
                :id="item.id"
                @click="handleCancelFavorite(item.id)"
                >
                </FavoriteBtn>


             </div>


             <!-- 文献基本信息 -->
              <div class="literature-info">
                <div class="info-item">
                    <div class="info-item">
                        <span class="label">作者：</span>
                        <span class="value">{{ item.author || "未知作者" }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">发表时间：</span>
                        <span class="value">{{ item.publishTime || "未知时间" }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">文献类型：</span>
                        <span class="value">{{ item.type || "其他" }}</span>
                    </div>
                </div>
              </div>


              <!-- 文献摘要
               <div class="literature-abstract">
                <span class="label">摘要:</span>
                  <el-collapse-transition>
                    <div v-if="showAbstract[index]">
                        <p class="abstract-content">
                            {{ item.source || '暂无摘要信息' }}
                        </p>
                    </div>

                    <div v-else>
                        <p class="abstract-content ellipsis">
                            {{ item.source || '暂无摘要信息' }}
                        </p>
                    </div>
                </el-collapse-transition>

                <el-button
                type="text"
                size="small"
                @click="showAbstract[index]=!showAbstract[index]"
                >
                {{ showAbstract[index]?"收起":"展开" }}
            
            </el-button>
               </div> -->

               <!-- 查看详情按钮 -->
                <div class="card-footer">
                    <el-button
                    type="primary"
                    size="small"
                    @click="goToDetail(item.id)"
                    >
                    查看文献详情
                
                </el-button>
                </div>
        </el-card>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useLiteratureStore } from '../../store/literatureStore';
import { onMounted,ref } from 'vue';
import FavoriteBtn from '../../components/literature/FavoriteBtn.vue';

const router=useRouter()
const literatureStore=useLiteratureStore()

// 控制摘要展开收起状态
const showAbstract=ref([])

onMounted(async ()=>{
    await literatureStore.getFavoriteList()
    showAbstract.value=literatureStore.favoriteList.map(()=>false)
})

// 取消收藏
const handleCancelFavorite=async (id)=>{
    try {
    await literatureStore.removeFavorite(id);
    ElMessage.success("取消收藏成功");
    // 重新加载收藏列表（确保数据同步）
    await literatureStore.getFavoriteList();
    // 重置摘要展开状态
    showAbstract.value = literatureStore.favoriteList.map(() => false);
  } catch (error) {
    ElMessage.error("取消收藏失败，请重试");
  }
}

// 跳到详情页
const goToDetail=(id)=>{
    router.push(`/literature/${id}`)
}

// 跳转到首页检索
const goToSearch=()=>{
    router.push('/')
}
</script>


<style lang="less">
.favorite-page-container{
    padding: 24px;
    background-color: #f9fafb;
    min-height: calc(100vh-120px);
    box-sizing: border-box;
}

.favorite-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

// 核心卡片样式：占满整行，精致边框和阴影
.favorite-card {
  width: 100%; // 强制占满父容器宽度
  border: 1px solid #ebeef5; // 淡色边框，避免厚重感
  border-radius: 8px; // 圆角优化，更现代
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); // 轻微阴影，hover时增强
  transition: all 0.3s ease; // 过渡动画，交互更流畅
  overflow: hidden; // 避免内容溢出卡片

  // hover效果：提升层次感
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); // 加深阴影
    border-color: #e1f0fe; // 边框变色，呼应主题色
  }
}

// 卡片头部：标题+取消收藏按钮布局
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 20px; // 内边距优化，避免拥挤
  border-bottom: 1px solid #f2f3f5; // 分隔线，区分头部和内容

  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #1d2129; // 标题深色，更醒目
    margin: 0;
    line-height: 1.4; // 行高优化，避免换行拥挤
    // 标题超长处理
    display: -webkit-box;
    -webkit-line-clamp: 2; // 最多显示2行
    -webkit-box-orient: vertical;
    overflow: hidden;
    cursor: pointer; // 提示可点击（若后续加标题跳转）

    &:hover {
      color: #409eff; //  hover变色，增强交互
    }
  }

  
}

// 文献信息区域：整齐排列，避免拥挤
.literature-info {
  padding: 16px 20px;
  font-size: 14px;
  color: #4e5969; // 信息文字淡色，不抢标题风头

  .info-item {
    display: flex;
    align-items: center;
    margin-right: 24px; // 信息项之间间距
    margin-bottom: 8px; // 换行时的垂直间距

    .label {
      color: #86909c; // 标签色更淡，区分内容
      margin-right: 6px;
      white-space: nowrap; // 标签不换行
    }

    .value {
      white-space: nowrap; // 内容不换行，避免错乱
      // 内容超长处理
      &:not(:has(+ .value)) {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>