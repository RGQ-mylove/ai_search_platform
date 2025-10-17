<template>
  <div class="search-input-container">
    <el-input
    class="input"
    v-model="inputValue"
    placeholder="请输入关键词（如人工智能）"
    @input="handleInput"
    @clear="handleClear"
    clearable
    size="large"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from '@/utils/debounce'

const props=defineProps({
  modelValue:{
    type:String,
    default:''
  }
})
// 定义组件对外触发的事件
const emit = defineEmits(['search', 'clear'])
const inputValue = ref(props.modelValue)

// 防抖处理
const handleInput = debounce((value) => {
  emit('search', value) // 触发父组件search事件
}, 300)

// const handleInput =(value) => {
//   emit('search', value) // 触发父组件search事件
// }
// 处理输入框清除
const handleClear = () => {
  inputValue.value = ''
  emit('clear')
}
</script>

<style scoped lang="less">
.search-input-container{
  width: 100%;
  max-width: 600px;
  margin:0 auto;

  .input{
    border-radius: 20px;
  }
}
</style>
