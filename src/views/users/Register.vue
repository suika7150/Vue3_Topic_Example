<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <el-card class="register-card" shadow="never">
      <div class="register-header">
        <h2 class="title">會員註冊</h2>
      </div>

      <el-form :model="form" :rules="rules" ref="registerForm" label-position="top">
        <el-form-item label="帳號" prop="username" :error="backendErrors.username">
          <el-input
            v-model="form.username"
            @input="backendErrors.username = ''"
            placeholder="請輸入帳號（3-20個字符）"
            clearable
          />
        </el-form-item>

        <el-form-item label="Email" prop="email" :error="backendErrors.email">
          <div class="email-wrapper">
            <el-input
              v-model="form.email"
              @input="backendErrors.email = ''"
              placeholder="請輸入Email地址"
              clearable
            />
            <el-button
              class="send-code-btn"
              :disabled="emailCountdown > 0 || !form.email"
              @click="handleSendEmailCode"
            >
              {{ emailCountdown > 0 ? `${emailCountdown}s 重新發送` : '發送驗證碼' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="信箱驗證碼" prop="emailCode">
          <div class="verify-input-wrapper">
            <el-input v-model="form.emailCode" placeholder="請輸入6位驗證碼" maxlength="6" />
            <span class="mock-code-hint" v-if="mockCodeDisplay">
              測試驗證碼: {{ mockCodeDisplay || '尚未發送' }}
            </span>
          </div>
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

        <el-form-item label="性別" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="M">男</el-radio>
            <el-radio label="F">女</el-radio>
            <el-radio label="O">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="選擇您的生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="手機號碼" prop="phone" :error="backendErrors.phone">
          <el-input
            v-model="form.phone"
            @input="backendErrors.phone = ''"
            placeholder="請輸入手機號碼"
            clearable
          />
        </el-form-item>

        <el-form-item class="agreement-section">
          <el-checkbox v-model="form.agreeTerms" :true-label="true" :false-label="false">
            我已閱讀並同意
            <el-link type="primary" @click="showTerms">《服務條款》</el-link>
            和
            <el-link type="primary" @click="showPrivacy">《隱私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button class="register-btn" @click="handleRegister" :loading="loading">
            註冊
          </el-button>
        </el-form-item>

        <div class="register-links">
          <span>已有帳號?</span>
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
import api from '@/services/api'
import { ResultCode, getMsgByCode } from '@/utils/resultCode'
import { toast } from '@/utils/message'
import { useNavigation } from '@/composables/useNavigation'

const { goLogin } = useNavigation()
const registerForm = ref()
const loading = ref(false)
const termsVisible = ref(false)
const privacyVisible = ref(false)
const emailCountdown = ref(0) // 信箱驗證碼倒數計時
const mockCodeDisplay = ref('') // 顯示在按鈕旁的變數

const backendErrors = ref({
  username: '',
  email: '',
  phone: '',
})

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  phone: '',
  gender: '',
  birthday: '',
  emailCode: '',
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
  username: [{ validator: validateUsername, required: true, trigger: 'blur' }],
  email: [{ validator: validateEmail, required: true, trigger: 'blur' }],
  password: [{ validator: validatePassword, required: true, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, required: true, trigger: 'blur' }],
  fullName: [
    { required: false, message: '請輸入姓名', trigger: 'blur' },
    { min: 2, message: '姓名至少需要2個字符', trigger: 'blur' },
  ],
  phone: [{ validator: validatePhone, required: true, trigger: 'blur' }],
  gender: [{ required: true, message: '請選擇性別', trigger: 'change' }],
  birthday: [{ required: true, message: '請選擇生日', trigger: 'change' }],
  emailCode: [
    { required: true, message: '請輸入6位驗證碼', trigger: 'blur' },
    { len: 6, message: '驗證碼長度應為 6 位', trigger: 'blur' },
  ],
  agreeTerms: [{ validator: validateTerms, trigger: 'change' }],
}

// 模擬信箱驗證碼倒數計時
const handleSendEmailCode = async () => {
  if (!form.value.email) return toast.error('請輸入Email地址')

  // 僅驗證 Email 欄位，格式正確才發送 API
  registerForm.value.validateField('email', async (valid) => {
    if (!valid) return // 如果 Email 格式錯誤（如沒寫 .com），直接攔截
    try {
      // 先清空舊的後端錯誤訊息
      backendErrors.value.email = ''

      const res = await api.sendEmailCode(form.value.email)

      const code = res.result || (res.data && res.data.result) || res
      if (code) {
        mockCodeDisplay.value = typeof code === 'object' ? code.result : code
        toast.success(`驗證碼已發送至您的信箱`)
      }

      // 倒數計時
      emailCountdown.value = 60
      const timer = setInterval(() => {
        emailCountdown.value--
        if (emailCountdown.value <= 0) {
          clearInterval(timer)
          mockCodeDisplay.value = '' // 清除顯示的驗證碼
        }
      }, 1000)
    } catch (error) {
      // 處理「信箱已存在」或其他錯誤
      const code = error.code
      const message = getMsgByCode(code)

      if (code === ResultCode.EMAIL_IS_EXIST) {
        backendErrors.value.email = message
      } else {
        toast.error('發送驗證碼失敗，請稍後再試。')
      }
    }
  })
}

const handleRegister = async () => {
  if (!registerForm.value) return

  // 每次註冊前先清空舊的後端錯誤
  backendErrors.value.username = ''
  backendErrors.value.email = ''
  backendErrors.value.phone = ''

  try {
    const valid = await registerForm.value.validate()
    if (!valid) return

    loading.value = true

    const res = await api.register(form.value)
    toast.success('註冊成功！請登入您的帳號')
    goLogin()
  } catch (error) {
    //獲取後端回傳的 code
    const code = error.code
    const message = getMsgByCode(code)

    // 根據 code 分流顯示錯誤
    if (code === ResultCode.ACCOUNT_IS_EXIST) {
      backendErrors.value.username = message // 帳號重複，紅字噴在帳號欄
    } else if (code === ResultCode.EMAIL_IS_EXIST) {
      backendErrors.value.email = message // Email 重複，紅字噴在 Email 欄
    } else {
      // 其他錯誤（如驗證碼錯誤、系統繁忙）用彈窗
      toast.error(message)
    }
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
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
}

.register-header {
  text-align: center;
  margin-bottom: 50px;
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

/** Email驗證碼區塊 */
.email-wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
}

/** Email驗證碼區塊 */
.send-code-btn {
  height: 44px;
  width: 120px;
  background-color: #000;
  color: #fff;
  border: none;
}

/** Email驗證碼區塊 */
.send-code-btn:disabled {
  background-color: #f5f7fa;
  color: #a8abb2;
}

/** Email驗證碼區塊*/
.verify-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

/** Email驗證碼區塊 */
.mock-code-hint {
  font-size: 12px;
  font-weight: bold;
  color: #f56c6c;
  background-color: #fef0f0;
  border: 1px dashed #f56c6c;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap; /* 避免換行 */
  font-family: 'Courier New', Courier, monospace;
}

.el-form-item {
  margin-bottom: 20px;
}

.agreement-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

:deep(.agreement-section .el-form-item__content) {
  margin-left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

.register-btn {
  font-size: 16px;
  height: 44px;
  width: 100%;
  border-radius: 8px;
  background-color: black;
  color: white;
  box-shadow: none;
  padding: 8px 12px;
}

.register-links {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 8px;
  margin-top: 20px;
  color: #666;
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

/** el-input 樣式 */
:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  padding-left: 5px;
  padding-right: 5px;
  transition: border-color 0.3s ease;
}

/** 滑過聚焦樣式 */
:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus),
:deep(.el-form-item.is-error) .el-input__wrapper {
  border-bottom: 1px solid #000;
}

/** 輸入框內容樣式 */
:deep(.el-input__inner) {
  font-size: 15px;
  font-weight: 500;
  color: #000;
  padding-top: 5px;
}

:deep(.el-input__inner::placeholder) {
  font-size: 15px;
  color: #a8abb2;
}

:deep(.el-form-item__label) {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  font-size: 15px;
  margin-bottom: 4px;
  padding: 0;
  line-height: 1;
}

/* 移除驗證失敗的紅框 */
:deep(.el-form-item.is-error) .el-input__wrapper,
:deep(.el-form-item.is-error) .el-input__wrapper:hover,
:deep(.el-form-item.is-error) .el-input__wrapper.is-focus {
  box-shadow: none;
}

/* 強制覆蓋 Chrome 自動填入時的藍色背景 */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #000 !important;
  transition: background-color 5000s ease-in-out 0s;
}

@media (max-width: 768px) {
  .agreement-section {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .title {
    font-size: 26px;
    margin-bottom: 20px;
  }

  .register-links {
    font-size: 14px;
  }
}
</style>
