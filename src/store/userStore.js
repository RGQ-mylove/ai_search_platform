import { defineStore, ref } from 'pinia'
export const useUserStore = defineStore('user', () => {
    const token=ref(localStorage.getItem('token' || ''))

    const searchHistory=ref(
        JSON.parse(localStorage.getItem('searchHistory')) || []
    )

    // 登录，存储Token并持久化
    const login=(tokenValue)=>{
        token.value=tokenValue
        localStorage.setItem('token',tokenValue)
    }

    // 退出，清空token和用户状态
    const loginout=()=>{
        token.value=''
        searchHistory.value=[]
        localStorage.removeItem('token')
        localStorage.removeItem('searchHistory')
    }

    // 添加检索历史：去重并且最多20条
    const addSearchHistory=(keyword)=>{
        if(!keyword.trim()) return
        // 把跟检索历史相同的过滤掉
        searchHistory.value=searchHistory.filter(item=>item!==keyword)
        searchHistory.value.unshift(keyword)

        // 限制20条，超过就删除最后一条
        if(searchHistory.value.length>20){
            searchHistory.value.pop()
        }

        // 持久化到localStorage
        localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value))


    }

    // 清空搜索历史
    const clearHistory=()=>{
        searchHistory.value=[]
        localStorage.removeItem('searchHistory')
    }

    return {
        token,
        searchHistory,
        login,
        loginout,
        addSearchHistory,
        clearHistory
    }
})