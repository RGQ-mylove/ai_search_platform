<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';

</script>

<template>
    <div class="skeleton-container">
        <!-- 3个骨架项 -->
         <div class="skeleton-item" v-for="i in 3" :key="i">
            <!-- 骨架屏：用Element的Skeleton组件 -->
             <el-skeleton :Loading="true" animated>
                <div class="skeleton-content">
                    <!-- 左侧图片占位 -->
                     <div class="skeleton-img"></div>
                     <!-- 右侧文字占位 -->
                      <div class="skeleton-text">
                        <div class="skeleton-title">

                        </div>

                        <div class="skeleton-desc"></div>

                        <div class="skeleton-meta"></div>
                      </div>
                </div>
             </el-skeleton>

         </div>
    </div>
</template>

<style scoped lang="less">
.skeleton-container{
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 10px;

    .skeleton-item{
        width: 100%;
        border-radius: 8px;
        overflow: hidden;

        .skeleton-content{
            display: flex;
            gap: 16px;
            padding: 16px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);

            .skeleton-img{
                width: 120px;
                height: 80px;
                border-radius: 4px;
                background: #f2f2f2;
            }

            .skeleton-text{
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
                .skeleton-title{
                    width: 60%;
                    height: 18px;
                    background: #f2f2f2;

                }
            }
        }



    }

}







</style>