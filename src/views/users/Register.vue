<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="title">會員註冊</h2>

      <el-form :model="form" :rules="rules" ref="registerForm" label-width="80px">
        <el-form-item label="帳號" prop="username">
          <el-input v-model="form.username" placeholder="請輸入帳號（3-20個字符）" clearable />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="請輸入Email地址" clearable />
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="請輸入密碼（至少6個字符）"
            clearable
          />
        </el-form-item>

        <el-form-item label="確認密碼" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="請再次輸入密碼"
            clearable
            @keyup.enter="handleRegister"
          />
        </el-form-item>

        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="請輸入真實姓名" clearable />
        </el-form-item>

        <el-form-item label="手機號碼" prop="phone">
          <el-input v-model="form.phone" placeholder="請輸入手機號碼" clearable />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.agreeTerms" :true-label="true" :false-label="false">
            我已閱讀並同意
            <el-link type="primary" @click="showTerms">《服務條款》</el-link>
            和
            <el-link type="primary" @click="showPrivacy">《隱私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            clss="register-btn"
            @click="handleRegister"
            :loading="loading"
            style="width: 100%"
          >
            註冊
          </el-button>
        </el-form-item>

        <div class="register-links">
          <span>已有帳號？</span>
          <el-link type="primary" @click="login">立即登入</el-link>
        </div>
      </el-form>
    </el-card>

    <!-- 服務條款對話框 -->
    <el-dialog v-model="termsVisible" title="服務條款" width="60%" center>
      <div class="terms-content">
        <h3>1. 服務說明</h3>
        <p>本網站提供的服務包括但不限於內容瀏覽、用戶互動等功能。</p>

        <h3>2. 用戶責任</h3>
        <p>用戶應當遵守相關法律法規，不得發布違法、有害信息。</p>

        <h3>3. 隱私保護</h3>
        <p>我們承諾保護用戶隱私，不會未經授權洩露用戶個人信息。</p>

        <h3>4. 免責聲明</h3>
        <p>本網站對用戶使用服務過程中產生的損失不承擔責任。</p>
      </div>
      <template #footer>
        <el-button @click="termsVisible = false">關閉</el-button>
      </template>
    </el-dialog>

    <!-- 隱私政策對話框 -->
    <el-dialog v-model="privacyVisible" title="隱私政策" width="60%" center>
      <div class="privacy-content">
        <h3>1. 信息收集</h3>
        <p>我們會收集您提供的註冊信息，用於帳號管理和服務提供。</p>

        <h3>2. 信息使用</h3>
        <p>收集的信息僅用於提供服務、改善用戶體驗和必要的溝通。</p>

        <h3>3. 信息保護</h3>
        <p>我們採用適當的技術和管理措施保護您的個人信息安全。</p>

        <h3>4. 信息分享</h3>
        <p>除法律要求外，我們不會與第三方分享您的個人信息。</p>
      </div>
      <template #footer>
        <el-button @click="privacyVisible = false">關閉</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '@/service/api'
import { useNavigation } from '@/composables/useNavigation'

const { goLogin } = useNavigation()
const registerForm = ref()
const loading = ref(false)
const termsVisible = ref(false)
const privacyVisible = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phone: '',
  agreeTerms: false,
})

// 自定義驗證規則
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入帳號'))
  } else if (value.length < 3 || value.length > 20) {
    callback(new Error('帳號長度應在3-20個字符之間'))
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error('帳號只能包含字母、數字和下劃線'))
  } else {
    callback()
  }
}

const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入Email地址'))
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('請輸入有效的Email地址'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入密碼'))
  } else if (value.length < 6) {
    callback(new Error('密碼至少需要6個字符'))
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
    callback(new Error('密碼必須包含字母和數字'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請確認密碼'))
  } else if (value !== form.value.password) {
    callback(new Error('兩次輸入的密碼不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入手機號碼'))
  } else if (!/^09\d{8}$/.test(value)) {
    callback(new Error('請輸入有效的台灣手機號碼'))
  } else {
    callback()
  }
}

const validateTerms = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請同意服務條款和隱私政策'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  fullName: [
    { required: true, message: '請輸入姓名', trigger: 'blur' },
    { min: 2, message: '姓名至少需要2個字符', trigger: 'blur' },
  ],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  agreeTerms: [{ validator: validateTerms, trigger: 'change' }],
}

const handleRegister = async () => {
  if (!registerForm.value) return

  try {
    const valid = await registerForm.value.validate()
    if (!valid) return

    loading.value = true

    // 模擬註冊API調用
    await api.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      fullName: form.value.fullName,
      phone: form.value.phone,
    })

    ElMessage.success('註冊成功！請登入您的帳號')

    // 註冊成功後跳轉到登入頁面
    goLogin()
  } catch (error) {
    ElMessage.error(error.message || '註冊失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

const showTerms = () => {
  termsVisible.value = true
}

const showPrivacy = () => {
  privacyVisible.value = true
}

const login = () => {
  goLogin()
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, black 100%, #8183ad 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 500px;
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

.register-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: #666;
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

.terms-content,
.privacy-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.terms-content h3,
.privacy-content h3 {
  color: #409eff;
  margin-top: 20px;
  margin-bottom: 10px;
}

.terms-content p,
.privacy-content p {
  line-height: 1.6;
  margin-bottom: 15px;
  color: #666;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .register-card {
    margin: 10px;
    padding: 20px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
