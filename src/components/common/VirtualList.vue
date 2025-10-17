<template>
  <!-- 虚拟列表外层容器：固定高度，超出滚动 -->
  <div 
    class="virtual-list-container"
    :style="{ height: config.listHeight }"
    @scroll.passive="handleScroll"
  >
    <!-- 1. 占位容器：撑起总高度，让滚动条正常显示 -->
    <div 
      class="virtual-list-placeholder"
      :style="{ height: `${totalHeight}px` }"
    ></div>

    <!-- 2. 真实渲染区域：只渲染可视区+缓冲区数据 -->
    <div 
      class="virtual-list-content"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <!-- 插槽：让父组件自定义每条数据的渲染样式 -->
      <slot 
        v-for="item in visibleData"
        :key="item[keyField]"  
        :item="item"           
      ></slot>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { computed, onMounted, ref } from 'vue';


const props=defineProps({
    data:{
        type:Array,
        required:true,
        default:()=>[]
    },
    keyField:{
        type:String,
        required:true
    },
    config:{
        type:Object,
        default:()=>({
            itemHeight:220,
            overscan:5,
            listHeight:'500px'
        })
    }
})

const visibleData=ref([]) // 最终要渲染的
const offset=ref(0) // 真实渲染区的偏移量

const totalHeight=computed(()=>{
    return props.data.length*props.config.itemHeight
})


// 计算可视区能容纳的条目数
const getVisibleCount=()=>{
    // 容器高度转换
    const containerHeight=parseInt(window.getComputedStyle(document.querySelector('.virtual-list-container')).height)
    return Math.ceil(containerHeight/props.config.itemHeight)
}

// 滚动事件处理
const handleScroll=(e)=>{
    const scroll = e.target.scrollTop;
    const visibleCount=getVisibleCount()
    const overscan=props.config.overscan

    // 计算起始索引
    const startIndex=Math.floor(scroll/props.config.itemHeight)
    const endIndex=startIndex+visibleCount+2*overscan

    visibleData.value=props.data.slice(
        Math.max(0,startIndex-overscan),
        Math.min(props.data.length,endIndex)
    )

    // 计算偏移量
    offset.value=startIndex*props.config.itemHeight
}

// 初始化可视数据
const initVisibleData=()=>{
    const visibleCount=getVisibleCount()
    visibleData.value=props.data.slice(0,visibleCount+props.config.overscan)
}

onMounted(()=>{
    initVisibleData()
})

watch(()=>props.data,()=>{
    initVisibleData();
    offset.value=0
},{
    deep:true
})
</script>


<style lang="less" scoped>
/* 外层容器：相对定位，作为子元素的定位基准 */
.virtual-list-container {
  position: relative;
  overflow-y: auto;  /* 只显示垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条（避免布局错乱） */

  width: 100%;
}

/* 占位容器：透明，仅用于撑起高度 */
.virtual-list-placeholder {
  width: 100%;
  opacity: 0;
}

/* 真实渲染区域：绝对定位，通过translateY控制位置 */
.virtual-list-content {
  
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-right: 17px;
  
}
</style>