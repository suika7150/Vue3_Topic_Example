<!-- 帳號:Admin12 // 密碼:A12345 -->
<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-ad-section">
        <div class="ad-content">
          <h3>年度盛典正式開啟</h3>
          <p>立即登入領取雙 11 限定優惠券</p>
          <div class="ad-placeholder">AD / PROMO IMAGE</div>
        </div>
      </div>

      <div class="login-form-section">
        <h2 class="title">會員登入</h2>
        <el-form :model="form" :rules="rules" ref="loginForm" label-position="top">
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

          <div class="form-options">
            <el-checkbox v-model="form.rememberUsername">記住帳號</el-checkbox>
            <el-checkbox v-model="form.rememberMe">保持登入</el-checkbox>
          </div>

          <el-button class="login-btn" @click="handleLogin"> 登入 </el-button>

          <div class="login-links">
            <el-link type="info" :underline="false" @click="handleForgotPassword"
              >忘記密碼？</el-link
            >
            <el-link type="primary" :underline="false" @click="handleRegister">註冊新帳號</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useUserStore } from '@/store/userStore'
import Storage, { TOKEN_KEY, USER_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const qrValue = ref('https://your-store.com/promo/default')

const { goTo, goHome } = useNavigation()

const loginForm = ref()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
  rememberMe: false,
  rememberUsername: false,
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

    //存入 Pinia
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

//尚未開發
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

/* 左側廣告區 */
.login-ad-section {
  flex: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: white;
}

.ad-content {
  text-align: center;
}

.ad-placeholder {
  margin-top: 20px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
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

.form-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

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

@media (max-width: 768px) {
  .login-ad-section {
    display: none;
  }
  .login-form-section {
    width: 100%;
  }
}

.el-input :deep(.el-input__inner) {
  height: 44px;
}
:deep(.el-form-item__label) {
  padding-bottom: 4px;
  font-weight: 500;
}
</style>
