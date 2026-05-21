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
            @input="((backendErrors.username = ''), markFieldTouched('username'))"
            placeholder="請輸入帳號（3-20個字符）"
            clearable
          >
            <template #suffix>
              <el-icon
                v-if="fieldTouched.username"
                :class="fieldValidStatus.username ? 'valid-icon' : 'invalid-icon'"
              >
                <Check v-if="fieldValidStatus.username" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email" :error="backendErrors.email">
          <div class="email-wrapper">
            <el-input
              v-model="form.email"
              :readonly="emailVerified"
              @input="((backendErrors.email = ''), markFieldTouched('email'))"
              placeholder="請輸入Email"
              clearable
            >
              <template #suffix>
                <el-icon
                  v-if="fieldTouched.email || emailVerified"
                  :class="emailVerified || fieldValidStatus.email ? 'valid-icon' : 'invalid-icon'"
                >
                  <Check v-if="emailVerified || fieldValidStatus.email" />
                  <Close v-else />
                </el-icon>
              </template>
            </el-input>
            <el-button
              class="btn btn--primary btn--sm"
              :disabled="emailCountdown > 0 || !form.email || emailVerified"
              @click="handleSendEmailCode"
            >
              {{
                emailVerified
                  ? '已驗證'
                  : emailCountdown > 0
                    ? `${emailCountdown}s 重新發送`
                    : '發送驗證碼'
              }}
            </el-button>
          </div>
          <div v-if="emailCodeSent" class="email-send-tip">驗證碼已寄送至 {{ form.email }}</div>
        </el-form-item>

        <el-form-item v-if="emailCodeSent" label="信箱驗證碼" prop="emailCode">
          <div class="verify-wrapper">
            <el-input
              v-model="form.emailCode"
              :readonly="emailVerified"
              placeholder="請輸入驗證碼"
              maxlength="6"
              class="verify-input"
            />

            <el-button
              class="btn btn--primary btn--sm verify-btn"
              :class="{ verified: emailVerified }"
              :disabled="emailVerified"
              @click="handleVerifyEmailCode"
            >
              {{ emailVerified ? '已驗證' : '確認驗證碼' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="請輸入密碼（至少6個字符）"
            clearable
            @input="markFieldTouched('password')"
          >
            <template #suffix>
              <el-icon
                v-if="fieldTouched.password"
                :class="fieldValidStatus.password ? 'valid-icon' : 'invalid-icon'"
              >
                <Check v-if="fieldValidStatus.password" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="確認密碼" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="請再次輸入密碼"
            clearable
            @input="markFieldTouched('confirmPassword')"
            @keyup.enter="handleRegister"
          >
            <template #suffix>
              <el-icon
                v-if="fieldTouched.confirmPassword"
                :class="fieldValidStatus.confirmPassword ? 'valid-icon' : 'invalid-icon'"
              >
                <Check v-if="fieldValidStatus.confirmPassword" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="請輸入姓名" clearable />
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
            @input="((backendErrors.phone = ''), markFieldTouched('phone'))"
            placeholder="請輸入手機號碼"
            clearable
          >
            <template #suffix>
              <el-icon
                v-if="fieldTouched.phone"
                :class="fieldValidStatus.phone ? 'valid-icon' : 'invalid-icon'"
              >
                <Check v-if="fieldValidStatus.phone" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="agreement-section" prop="agreeTerms">
          <el-checkbox v-model="form.agreeTerms" :true-label="true" :false-label="false">
            我已閱讀並同意
            <el-link type="primary" @click.stop="showTerms">《服務條款》</el-link>
            和
            <el-link type="primary" @click.stop="showPrivacy">《隱私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button class="btn btn--primary btn--full" @click="handleRegister" :loading="loading">
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
import { useRegister } from '@/composables/useRegister'
import { Check, Close } from '@element-plus/icons-vue'

const {
  registerForm,
  loading,

  form,
  rules,

  backendErrors,

  fieldTouched,
  fieldValidStatus,
  markFieldTouched,

  emailVerified,
  emailCountdown,
  emailCodeSent,

  termsVisible,
  privacyVisible,

  handleSendEmailCode,
  handleVerifyEmailCode,
  handleRegister,

  showTerms,
  showPrivacy,
  login,
} = useRegister()
</script>

<style scoped>
/* Layout 容器 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

/* 註冊卡片主體 */
.register-card {
  width: 100%;
  max-width: 800px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
}

.el-form-item {
  margin-bottom: 30px;
}

/* Header 區塊 */
.register-header {
  text-align: center;
  margin-bottom: 50px;
}

/* 標題 */
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

.btn {
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0 14px;
}

/* 主色按鈕 */
.btn--primary {
  background-color: #000;
  color: #fff;
}

.btn--primary:hover {
  background-color: #222;
}

/* disabled */
.btn:disabled {
  background-color: #f5f7fa;
  color: #a8abb2;
  cursor: not-allowed;
}

/* 小尺寸按鈕 */
.btn--sm {
  height: 40px;
  font-size: 14px;
}

/* 全寬按鈕 */
.btn--full {
  width: 100%;
}

/* Email 外層 */
.email-wrapper {
  display: flex;
  width: 100%;
}

/* 提示文字 */
.email-send-tip {
  position: absolute;
  top: 40px;
  left: 2px;
  font-size: 13px;
  color: #67c23a;
}

/* 驗證輸入區*/
.verify-wrapper {
  display: flex;
  align-items: flex-start;
}

/* 驗證輸入樣式 */
.verify-input {
  flex: 1;
}

/* 驗證按鈕 */
.verify-btn {
  white-space: nowrap;
}

/* 立即登入區塊 */
.register-links {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 8px;
  margin-top: 20px;
  color: #666;
}

/* 條款區塊 */
.agreement-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

:deep(.agreement-section .el-form-item__content) {
  display: flex;
  justify-content: center;
  position: relative;
  margin-left: 0;
  width: 100%;
}

:deep(.agreement-section .el-form-item__error) {
  position: absolute;
  white-space: nowrap;
  text-align: center;
  top: 26px;
  left: 50%;
  margin: 0;
  line-height: 1.4;
  transform: translateX(-50%);
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

/* 即時驗證圖標 */
.valid-icon,
.invalid-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 即時驗證圖標 */
.valid-icon {
  background-color: #67c23a;
}

/* 即時驗證圖標 */
.invalid-icon {
  background-color: #f56c6c;
}

/* input 外框 */
:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  padding-left: 5px;
  padding-right: 5px;
  transition: border-color 0.3s ease;
}

/* 滑過聚焦樣式 */
:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus),
:deep(.el-form-item.is-error) .el-input__wrapper {
  border-bottom: 1px solid #000;
}

/* input 文字 */
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
  margin-bottom: 0px;
  padding: 0;
  line-height: 1;
}

/** 統一將所有錯誤訊息顯示在輸入框下方，並靠左對齊 */
:deep(.el-form-item__error) {
  position: absolute; /* 改為絕對定位，不撐開父容器高度 */
  top: 45px; /* 統一放在輸入框下方 */
  left: 2px; /* 靠左對齊並稍微縮排 */
  margin: 0;
  line-height: 1.4;
  text-align: left;
  background: none;
  pointer-events: none;
  z-index: 1;
}

/* error 去紅框 */
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
