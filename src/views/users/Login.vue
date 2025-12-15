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
          <el-checkbox v-model="form.rememberUsername">記住帳號</el-checkbox>
          <el-checkbox v-model="form.rememberMe">保持登入</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button class="login-btn" @click="handleLogin" style="width: 100%"> 登入 </el-button>
        </el-form-item>

        <div class="login-links">
          <el-link type="text" @click="handleForgotPassword">忘記密碼？</el-link>
          <el-link type="text" @click="handleRegister">註冊新帳號</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useUserStore } from '@/store/userStore'
import Storage, { TOKEN_KEY, USER_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const { goTo, goHome } = useNavigation()

const loginForm = ref()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
  rememberMe: false,
  rememberUsername: false,
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
  //讀取token
  const rememberUsername = Storage.get(USER_KEY)
  if (rememberUsername) {
    form.value.username = rememberUsername
    form.value.rememberUsername = true
  }

  const token = Storage.get(TOKEN_KEY)
  if (token) {
    userStore.login({ username: rememberUsername }, { token }) //回寫token
    userStore.startTokenCountdown(token) //標記已登入
    goHome()
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

    //存入Pinia
    userStore.login(loginData, res.result)
    userStore.startTokenCountdown(token)

    //存入 localStorage
    Storage.set(TOKEN_KEY, token)

    //記住帳號
    if (form.value.rememberUsername) {
      Storage.set(USER_KEY, form.value.username)
    } else {
      Storage.remove(USER_KEY)
    }

    ElMessage.success('登入成功！')
    goHome()
  } else {
    ElMessage.error('請檢查帳號及密碼')
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
  background: linear-gradient(135deg, #1bbfce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-btn {
  width: 100%;
  margin-right: 50px;
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
  background-color: black; /* 跟 Topbar 融合 */
  /* border: none; 去掉邊框 */
  color: white;
  box-shadow: none; /* 去掉陰影 */
  padding: 8px 12px; /* 可依 Topbar 調整 */
}

.el-input :deep(.el-input__inner) {
  height: 44px;
  border-radius: 8px;
}

/* --- :deep() 選擇器，專門修改此頁面的 el-checkbox 樣式 --- */
.login-container :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1bbfce; /* 您想要的勾選後背景色 */
  border-color: #1bbfce; /* 您想要的勾選後邊框色 */
}

.login-container :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #1bbfce; /* 您想要的勾選後文字顏色 */
}
</style>
