<template>
  <div class="empty-tip-container">
    <el-empty description="description" />

    <p class="empty-text">{{ text }}</p>

    <el-button
    v-if="btnText"
    :type="btnType"
    @click="handleBtnClick"
    size="small"
    >
    {{ btnText }}
  </el-button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Search, Star, Clock, Setting } from '@element-plus/icons-vue'
const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  btnText: {
    type: String,
    default: '' // 按钮文案，为空就不显示
  },
  btnType: {
    type: String,
    default: 'primary'
  }
})

const emit=defineEmits(['btn-click'])

const handleBtnClick=()=>{
  emit('btn-click')
}
</script>

<style lang="less" scoped>
.empty-tip-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon{
  font-size: 48px;
  margin-bottom: 16px;
  color: #ccc;
}

.empty-text{
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
