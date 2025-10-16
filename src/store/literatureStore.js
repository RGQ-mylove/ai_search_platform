import { defineStore} from 'pinia';
import { searchLiterature } from '../api/literature';
import { ref } from 'vue';


export const useLiteratureStore=defineStore('literature',()=>{
    // 检索结果,list存文献，total存总数
    const searchResults=ref({list:[],total:0})

    // 收藏列表：从localStorage读取
    const favoriteList=ref(
        (()=>{
            const stored=localStorage.getItem('favorites')
            try{
                return stored?JSON.parse(stored):[]
            }catch(err){
                console.error('解析错误，使用空数组');
                return []         
            }

        })()

    )

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

    const addFavorite=(item)=>{
        if(!favoriteList.value.some(f=>f.id===item.id)){
            favoriteList.value.push(item)
            // 持久化
            localStorage.setItem('favorites',JSON.stringify(favoriteList.value))
        }
    }

    // 取消收藏
    const removeFavorite=(id)=>{
        favoriteList.value=favoriteList.value.filter(f=>f.id!==id)
        localStorage.setItem('favorites',JSON.parse(favoriteList.value))
    }

    return {
        searchResults,
        favoriteList,
        getSearchResult,
        addFavorite,
        removeFavorite,
        clearSearchResult
    }
})