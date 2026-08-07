<template>
  <div class="register-page">
    <el-card class="register-card" shadow="never">
      <div class="register-card__header">
        <h2 class="register-card__title">會員註冊</h2>
      </div>

      <el-form
        class="register-form"
        :model="form"
        :rules="rules"
        ref="registerForm"
        label-position="top"
      >
        <!-- 帳號 -->
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
                :class="[
                  'status-icon',
                  fieldValidStatus.username ? 'status-icon--valid' : 'status-icon--invalid',
                ]"
              >
                <Check v-if="fieldValidStatus.username" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- Email 區塊 -->
        <el-form-item label="Email" prop="email" :error="backendErrors.email">
          <div class="register-form__inline-group">
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
                  :class="[
                    'status-icon',
                    fieldValidStatus.email ? 'status-icon--valid' : 'status-icon--invalid',
                  ]"
                >
                  <Check v-if="emailVerified || fieldValidStatus.email" />
                  <Close v-else />
                </el-icon>
              </template>
            </el-input>
            <el-button
              class="app-btn app-btn--primary app-btn--sm"
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
          <div v-if="emailCodeSent" class="register-form__tip">驗證碼已寄送至 {{ form.email }}</div>
        </el-form-item>

        <!-- Email 驗證碼區塊 -->
        <el-form-item v-if="emailCodeSent" label="信箱驗證碼" prop="emailCode">
          <div class="register-form__inline-group">
            <el-input
              v-model="form.emailCode"
              :readonly="emailVerified"
              placeholder="請輸入驗證碼"
              maxlength="6"
            />

            <el-button
              class="app-btn app-btn--primary app-btn--sm"
              :class="{ verified: emailVerified }"
              :disabled="emailVerified"
              @click="handleVerifyEmailCode"
            >
              {{ emailVerified ? '已驗證' : '確認驗證碼' }}
            </el-button>
          </div>
        </el-form-item>

        <!-- 密碼 -->
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
                :class="[
                  'status-icon',
                  fieldValidStatus.password ? 'status-icon--valid' : 'status-icon--invalid',
                ]"
              >
                <Check v-if="fieldValidStatus.password" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 確認密碼 -->
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
                :class="[
                  'status-icon',
                  fieldValidStatus.confirmPassword ? 'status-icon--valid' : 'status-icon--invalid',
                ]"
              >
                <Check v-if="fieldValidStatus.confirmPassword" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名" prop="fullName">
          <el-input
            v-model="form.fullName"
            placeholder="請輸入姓名"
            clearable
            @input="markFieldTouched('fullName')"
          >
            <template #suffix>
              <el-icon
                v-if="fieldTouched.fullName"
                :class="[
                  'status-icon',
                  fieldValidStatus.fullName ? 'status-icon--valid' : 'status-icon--invalid',
                ]"
              >
                <Check v-if="fieldValidStatus.fullName" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 性別 -->
        <el-form-item label="性別" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="M">男</el-radio>
            <el-radio label="F">女</el-radio>
            <el-radio label="O">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 生日 -->
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

        <!-- 手機號碼 -->
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
                :class="[
                  'status-icon',
                  fieldValidStatus.phone ? 'status-icon--valid' : 'status-icon--invalid',
                ]"
              >
                <Check v-if="fieldValidStatus.phone" />
                <Close v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 服務條款 -->
        <el-form-item class="register-form__agreement" prop="agreeTerms">
          <el-checkbox v-model="form.agreeTerms" :true-label="true" :false-label="false">
            我已閱讀並同意
            <el-link type="primary" @click.stop="showTerms">《服務條款》</el-link>
            和
            <el-link type="primary" @click.stop="showPrivacy">《隱私政策》</el-link>
          </el-checkbox>
        </el-form-item>

        <!-- 提交區塊 -->
        <el-form-item class="register-form__action">
          <el-button
            class="app-btn app-btn--primary app-btn--block"
            @click="handleRegister"
            :loading="loading"
          >
            註冊
          </el-button>
        </el-form-item>

        <div class="register-card__footer">
          <span>已有帳號?</span>
          <el-link type="primary" @click="login">立即登入</el-link>
        </div>
      </el-form>
    </el-card>

    <!-- 服務條款 -->
    <el-dialog v-model="termsVisible" title="服務條款" width="60%" center>
      <div class="article-viewer">
        <h3 class="article-viewer__title">1. 服務說明</h3>
        <p class="article-viewer__content">
          本網站提供的服務包括但不限於內容瀏覽、用戶互動等功能。
        </p>

        <h3 class="article-viewer__title">2. 用戶責任</h3>
        <p class="article-viewer__content">用戶應當遵守相關法律法規，不得發布違法、有害信息。</p>

        <h3 class="article-viewer__title">3. 隱私保護</h3>
        <p class="article-viewer__content">我們承諾保護用戶隱私，不會未經授權洩露用戶個人信息。</p>

        <h3 class="article-viewer__title">4. 免責聲明</h3>
        <p class="article-viewer__content">本網站對用戶使用服務過程中產生的損失不承擔責任。</p>
      </div>
      <template #footer>
        <el-button @click="termsVisible = false">關閉</el-button>
      </template>
    </el-dialog>

    <!-- 隱私政策 -->
    <el-dialog v-model="privacyVisible" title="隱私政策" width="60%" center>
      <div class="article-viewer">
        <h3 class="article-viewer__title">1. 信息收集</h3>
        <p class="article-viewer__content">我們會收集您提供的註冊信息，用於帳號管理和服務提供。</p>

        <h3 class="article-viewer__title">2. 信息使用</h3>
        <p class="article-viewer__content">收集的信息僅用於提供服務、改善用戶體驗和必要的溝通。</p>

        <h3 class="article-viewer__title">3. 信息保護</h3>
        <p class="article-viewer__content">我們採用適當的技術和管理措施保護您的個人信息安全。</p>

        <h3 class="article-viewer__title">4. 信息分享</h3>
        <p class="article-viewer__content">除法律要求外，我們不會與第三方分享您的個人信息。</p>
      </div>
      <template #footer>
        <el-button @click="privacyVisible = false">關閉</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRegister } from '@/domains/auth/views/Register/useRegister'
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
@import '@/domains/auth/views/Register/Register.scss';
</style>
