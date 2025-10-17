<template>
    <el-button
    :type="isFav?'success':'default'"
    :icon="isFav?StarFilled:Star"
    @click="handleFav"
    size="medium"
    
    >
    {{ isFav?'取消收藏':'收藏文献' }}

    </el-button>
</template>

<script setup>
import { computed, nextTick, ref,watch } from 'vue';
import { useLiteratureStore } from '../../store/literatureStore';
import { ElMessage } from 'element-plus';


const props=defineProps({
    id:{
        type:String,
        required:true
    }
})
const isFav=computed(()=>{
    if(!props.id) return false
    
    return literatureStore.favoriteList.some(item=>item.id===Number(props.id))

})

// 导入pinia，收藏管理列表
const literatureStore=useLiteratureStore()



const handleFav=async ()=>{
    try {
        if(isFav.value){
            await literatureStore.removeFavorite(props.id)
            ElMessage.success('已取消收藏');
        }else{
            await literatureStore.addFavorite(props.id)
            ElMessage.success('收藏成功');
        }
        

        // 重新更新pinia里面的收藏列表
        await literatureStore.getFavoriteList()
        await nextTick();
        console.log('更新后的isFav:', isFav.value);
        
        
        
    } catch (error) {
        console.error('收藏操作失败', error);
        ElMessage.error('操作失败，请重试');
        
    }
   
   

}



</script>