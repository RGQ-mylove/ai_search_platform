<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-title">
               <h1>文件检索系统</h1>
               
            </div>

            <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="80px"
            class="login-form"
            >

            <el-form-item
            label="用户名"
            prop="username"
            >
            <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            />
            </el-form-item>

            <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item class="login-btn-group">
          <el-button type="primary" @click="handleLogin" class="login-btn">
            登录
          </el-button>
          <el-button type="text" @click="handleRegister" class="register-btn">
            注册账号
          </el-button>
        </el-form-item>



            </el-form>
        </div>
        
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';


const loginForm=ref({
    username:'',
    password:''
})

const loginRules=ref({
    username:[{required:true,message:'请输入用户名',trigger:'blur'}],
    password:[{required:true,message:'请输入密码',trigger:'blur'}]
})
const loginFormRef=ref()

// 路由实例
const route=useRoute()
const router=useRouter()

const handleLogin=async()=>{
    if(!loginFormRef.value) return

    // 表单简单验证

    const valid=await loginFormRef.value.validate()

    if(!valid) return 

    try{
        
    }catch(error){
        
    }
}
</script>