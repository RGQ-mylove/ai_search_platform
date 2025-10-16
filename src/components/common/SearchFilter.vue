<template>

    <div class="search-filter">
        <!-- 按照类型筛选 -->
        <el-select
        v-model="typeVal"
        placeholder="文献类型"
        clearable
        size="small"
        @change="handleFilter"
        class="filter-select"
        >
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        ></el-option>

        </el-select>

        <!-- 根据日期筛选 -->
         <el-date-picker
         v-model="dateRange"
         type="daterange"
         range-separator="至"
         start-placeholder="开始时间"
         end-placeholder="结束时间"
         size="small"
         class="filter-date"
         @change="handleFilter"
         
         >

         </el-date-picker>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const value=ref('')
const typeVal=ref('')
const dateRange=ref([])

// 文献类型
const options=[
    {
    value: '',
    label: '全部类型',
  },
  {
    value: '学术论文',
    label: '学术论文',
  },
  {
    value: '行业报告',
    label: '行业报告',
  },
  {
    value: '技术文档',
    label: '技术文档',
  },
  {
    value: '综述文章',
    label: '综述文章',
  },
  {
    value: '案例研究',
    label: '案例研究',
  },
]


// 定义事件，向父组件传递筛选参数
const emit=defineEmits(['filter','reset'])

const handleFilter=()=>{
    const filterParams={
        type:typeVal.value,
        startDate:dateRange.value[0]?.toISOString().split('T')[0] || '',
        endDate:dateRange.value[1]?.toISOString().split('T')[0] || ''      
    }

    emit('filter',filterParams) // 向父组件传递筛选参数
}

const resetFilter=()=>{
    typeVal.value=''
    dateRange.value=[]
    emit('filter',{type:'',startDate:'',endDate:''})
    emit('reset')
}

// 5. 暴露重置方法，允许父组件调用
defineExpose({ resetFilter })


</script>

<style scoped lang="less">
.search-filter{
    display: flex;
    gap: 12px;
    margin: 16px 0;
    align-items: center;
}

.filter-select{
    width: 160px;
}

.filter-date{
    width: 300px;
}


 
</style>