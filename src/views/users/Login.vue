<!-- 帳號:Admin12 // 密碼:A12345 -->
<template>
  <div class="login-container">
    <div class="login-wrapper">
      <LoginAd />

      <div class="login-form-section">
        <h2 class="title">會員登入</h2>
        <el-form :model="form" :rules="rules" ref="loginForm" label-position="top">
          <el-form-item label="帳號" prop="username" :error="backendErrors.username">
            <el-input
              v-model="form.username"
              placeholder="請輸入帳號或Email"
              clearable
              @input="backendErrors.username = ''"
            />
          </el-form-item>

          <el-form-item label="密碼" prop="password" :error="backendErrors.password">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="請輸入密碼"
              clearable
              @keyup.enter="handleLogin"
              @input="backendErrors.password = ''"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="form.rememberUsername">記住帳號</el-checkbox>
            <el-checkbox v-model="form.rememberMe">保持登入</el-checkbox>
          </div>

          <el-button class="login-btn" @click="handleLogin"> 登入 </el-button>

          <div class="login-links">
            <el-link type="info" underline="never" @click="handleForgotPassword"
              >忘記密碼？</el-link
            >
            <el-link type="primary" underline="never" @click="handleRegister">註冊新帳號</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import api from '@/service/api'
import { useRoute } from 'vue-router'
import { useNavigation } from '@/composables/useNavigation'
import LoginAd from '@/components/LoginAd.vue'
import { useUserStore } from '@/store/userStore'
import Storage, { REMEMBER_USERNAME_KEY, REMEMBER_ME_KEY } from '@/utils/storageUtil'
import { toast } from '@/utils/message'
import { ResultCode, getMsgByCode } from '@/utils/resultCode'

const { goTo, goHome } = useNavigation()
const route = useRoute()
const userStore = useUserStore()
const loginForm = ref()

const form = ref({
  username: '',
  password: '',
  rememberMe: false,
  rememberUsername: false,
})

//儲存後端錯誤的變數
const backendErrors = ref({
  username: '',
  password: '',
})

// 驗證規則
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

onMounted(() => {
  //載入記住的帳號，讀取token
  const rememberUsername = Storage.get(REMEMBER_USERNAME_KEY)
  if (rememberUsername) {
    form.value.username = rememberUsername
    form.value.rememberUsername = true
  }
})

// 登入驗證
const handleLogin = async () => {
  if (!loginForm.value) return

  // 每次登入前先清空舊的後端錯誤
  backendErrors.value.username = ''
  backendErrors.value.password = ''

  // 執行表單驗證
  try {
    await loginForm.value.validate()
  } catch (error) {
    return // 驗證沒過就停止
  }

  // 發送給後端的資料
  const loginData = {
    username: form.value.username,
    password: form.value.password,
    rememberMe: form.value.rememberMe,
    isLogin: true,
  }

  // 發送請求與處理結果
  try {
    const res = await api.login(loginData)
    toast.success('登入成功')

    // 從後端回傳結果中解構出 token 和 role
    const { role, username } = res.result

    //存入 Pinia
    await userStore.login(res.result, {
      role: res.result.role,
      rememberUsername: form.value.rememberUsername,
      rememberMe: form.value.rememberMe,
    })

    // 如果網址有 ?redirect=/checkout，就去結帳頁，否則才回首頁
    const targetPath = route.query.redirect || '/'
    goTo(targetPath)
  } catch (error) {
    // 這裡的 error 是 apiService 拋出的 response.data
    const code = error.code

    console.debug('[認證] 登入失敗細節:', error)

    const message = getMsgByCode(code)
    if (code === ResultCode.FAIL) {
      toast.error('目前無法連線至伺服器，請檢查網路狀態')
    } else if (code === ResultCode.USER_NOT_FOUND || code === ResultCode.USER_IS_NOT_EXIST) {
      backendErrors.value.username = message
    } else if (code === ResultCode.PASSWORD_NOT_MATCH) {
      backendErrors.value.password = message
    } else {
      toast.error(message || '登入失敗')
    }
  }
}

//尚未開發
const handleForgotPassword = () => {
  toast.info('忘記密碼功能開發中...')
  goHome()
  // router.push('/forgot-password')
}

const handleRegister = () => {
  goTo('register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 40px 20px;
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
}

/* 右側帳密區 */
.login-form-section {
  width: 400px;
  padding: 50px 40px;
  background: white;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

/* --- 底線輸入框樣式 --- */
:deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  padding-left: 12px;
  padding-right: 12px;
  transition: border-color 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) :deep(.el-input__wrapper:hover) {
  border-bottom: 1px solid #000;
}
.el-input :deep(.el-input__inner) {
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  padding-top: 8px;
}
.form-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
/* 登入按鈕 */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-btn:hover {
  opacity: 0.8;
}

.login-links {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .login-form-section {
    width: 100%;
  }
}

:deep(.el-form-item__label) {
  padding-bottom: 4px;
  font-weight: 500;
}
</style>
