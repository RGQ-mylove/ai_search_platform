<template>
  <div class="search-input-container">
    

    <!-- <el-dropdown
    :visible="showSuggestList"
    placement="bottom-start"
    trigger="manual"
    @visible-change="(visible)=>showSuggestList=visible"
    >

    <div class="input-group">
      <el-input
    class="input"
    v-model="inputValue"
    placeholder="请输入关键词（如人工智能）"
    @input="handleInput"
    @focus="handleFocus"
    @clear="handleClear"
    clearable
    size="large"
    />

    <el-button
    class="search-btn"
    type="primary"
    @click="handleSearchClick"
    >立即搜索</el-button>
    </div>

    <el-dropdown-menu
     v-if="showSuggestList&&suggestList.length"
     class="suggest-dropdown"
     >
     <el-dropdown-item
     v-for="(item,index) in suggestList"
     :key="index"
     @click="selectSuggest(item)"
     >

     <span v-html="item.replace(new RegExp(inputValue,'gi'),match=>`<span class='highlight'>${match}</span>`)"></span>

     </el-dropdown-item>

     </el-dropdown-menu>

    </el-dropdown> -->

    <div class="search-input-wrap">
      <el-dropdown
     v-if="showSuggestList && suggestList.length"
     >

     <span class="el-dropdown-link">
      AI辅助联想词
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item,index) in suggestList"
          :key="index"
          @click="selectSuggest(item)"
          >

          {{item}}
     </el-dropdown-item>
      </el-dropdown-menu>
    </template>

    

     

     </el-dropdown>

      <el-input
    class="input"
    v-model="inputValue"
    placeholder="请输入关键词（如人工智能）"
    @input="handleInput"
    @focus="handleFocus"
    @clear="handleClear"
    clearable
    size="large"
    />

    <el-button
    class="search-btn"
    type="primary"
    @click="handleSearchClick"
    >立即搜索</el-button>
      

    </div>

    

    
    <!-- AI联想词下拉框 -->
     


  </div>
</template>

<script setup>
import { ref,watch } from 'vue'
import { debounce } from '@/utils/debounce'
import { getAISuggest } from '../../api/literature'


// 输入框的值

const props=defineProps({
  modelValue:{
    type:String,
    default:''
  }
})
// 定义组件对外触发的事件
const emit = defineEmits(['search', 'clear'])
const inputValue = ref(props.modelValue)
// 联想词列表
const suggestList=ref([])
// 是否显示联想下拉框
const showSuggestList=ref(false)


// 防抖处理
const handleInput = debounce(async (value) => {
  if(!value.trim()){
    suggestList.value=[]
    return
  }

  // 输入之后防抖去请求AI联想接口数据

  try {
    const res=await getAISuggest(value.trim())
    
   
    suggestList.value=res || []
    
    showSuggestList.value=true
    
  } catch (error) {
    console.error('AI联想接口请求失败',error);
    
    
  }
  
}, 300)

// 输入框聚焦时显示联想
const handleFocus=()=>{
  
  showSuggestList.value=suggestList.value.length>0
  
  
}

const handleSearchClick=()=>{
  if(inputValue.value.trim()){
    emit('search',inputValue.value.trim())  // 向父组件传递搜索关键词
    showSuggestList.value=false
  }
}

// 选择联想词，填充到输入框并触发搜索
const selectSuggest=(item)=>{
  inputValue.value=item
  emit('search',item)
  // 隐藏联想框
  showSuggestList.value=false
}


// const handleInput =(value) => {
//   emit('search', value) // 触发父组件search事件
// }
// 处理输入框清除
const handleClear = () => {
  inputValue.value = ''
  suggestList.value=[]
  showSuggestList.value=false
  emit('clear')
}

// watch(inputValue,(newVal)=>{
//   emit('update:modelValue',newVal)
// })
</script>

<style scoped lang="less">
.search-input-container{
  width: 100%;
  max-width: 600px;
  margin:0 auto;
  position: relative;

  .search-input-wrap{
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .input-group {
    display: flex;
    gap: 10px;
    align-items: center;
    
  }

  .input{
    flex: 1;
    border: 20px;
  }

  

  .suggest-dropdown{
    position: absolute;
    top: 100%;
    left: 0;
    width: calc(100% - 80px);
    margin-top: 5px;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    background: #fff;
  }

  .highlight{
    color: #409eff;
    font-weight: bold;
  }

}
</style>
