import { defineStore} from 'pinia';
import { searchLiterature } from '../api/literature';
import { addFavorites,getFavoriteListApi,removeFavoriteApi } from '../api/user';

import { nextTick, ref } from 'vue';
import { ElMessage } from 'element-plus';


export const useLiteratureStore=defineStore('literature',()=>{
    // 检索结果,list存文献，total存总数
    const searchResults=ref({list:[],total:0})

    // 收藏列表
    const favoriteList=ref([])


    // 获取收藏列表
    const getFavoriteList= async ()=>{
        try {
            const res=await getFavoriteListApi()
            favoriteList.value=res
        } catch (error) {
            ElMessage.error('出错了，请重试',error)
            console.log('获取收藏列表失败');      
        }
        
    }
    // 检索文件
    const getSearchResult=async(params)=>{
        
        
        try{
            
            const res=await searchLiterature(params)
            
            
            
            searchResults.value={
                list:res,
                total:res.length
            }


            
            
        }catch(err){
            searchResults.value={list:[],total:0}
            console.error('检索文献失败',err);
            
        }
    }

    const clearSearchResult=()=>{
        searchResults.value={
            list:[],
            total:0
        }
    }

    const addFavorite=async (id)=>{
        
        
        try {
            await addFavorites(id)
            await getFavoriteList()

            
           
            
        } catch (error) {
            ElMessage.error('操作失败')
            
        }
        
    }

    // 取消收藏
    const removeFavorite=async (id)=>{
        favoriteList.value=favoriteList.value.filter(f=>f.id!==id)
        await removeFavoriteApi(id)
        
    }

   
    return {
        searchResults,
        favoriteList,
        getSearchResult,
        getFavoriteList,
        addFavorite,
        removeFavorite,
        clearSearchResult
    }
})