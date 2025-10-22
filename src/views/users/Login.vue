<!-- src/views/Login.vue -->
<template>
  <!-- 帳號:Admin12 // 密碼:A12345 -->

  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">會員登入</h2>

      <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="帳號" prop="username">
          <el-input v-model="form.username" placeholder="請輸入帳號或Email" clearable />
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="請輸入密碼"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.rememberMe">記住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%"> 登入 </el-button>
        </el-form-item>

        <div class="login-links">
          <el-link type="primary" @click="handleForgotPassword">忘記密碼？</el-link>
          <el-link type="primary" @click="handleRegister">註冊新帳號</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useUserStore } from '@/store/userStore'
import Storage, { USER_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const { goTo, goHome } = useNavigation()

const loginForm = ref()
const userStore = useUserStore()

const form = ref({
  username: 'Admin12',
  password: 'A12345',
  rememberMe: false,
})

// 改進的驗證規則
const rules = {
  username: [
    { required: true, message: '請輸入帳號或Email', trigger: 'blur' },
    { min: 3, message: '帳號至少需要3個字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少需要6個字符', trigger: 'blur' },
  ],
}

// 載入記住的帳號
onMounted(() => {
  const rememberedUsername = Storage.get(USER_KEY)
  if (rememberedUsername) {
    form.value.username = rememberedUsername
    form.value.rememberMe = true
  }
})

const handleLogin = async () => {
  if (!loginForm.value) return

  const valid = await loginForm.value.validate()
  if (!valid) return

  const loginData = {
    username: form.value.username,
    password: form.value.password,
    rememberMe: form.value.rememberMe,
    isLogin: true,
  }

  const res = await api.login(loginData)
  if (res.code === '0000') {
    const { token } = res.result
    userStore.login(loginData, res.result)
    userStore.startTokenCountdown(token)
    ElMessage.success('登入成功！')
    goHome()
  }
}

const handleForgotPassword = () => {
  ElMessage.info('忘記密碼功能開發中...')
  // router.push('/forgot-password')
}

const handleRegister = () => {
  goTo('Register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 100%, #8183ad 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  font-size: 16px;
  height: 44px;
  border-radius: 8px;
}

.el-input :deep(.el-input__inner) {
  height: 44px;
  border-radius: 8px;
}
</style>
