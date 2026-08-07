import { ref, computed, watch } from 'vue'
import api from '@/services/api'
import { ResultCode, getMsgByCode } from '@/utils/resultCodeUtil'
import { toast } from '@/utils/toastUtil'
import { useNavigation } from '@/composables/useNavigation'

export function useRegister() {
  const { goLogin } = useNavigation()

  const registerForm = ref()
  const loading = ref(false) // 註冊按鈕

  const termsVisible = ref(false) // 服務條款與隱私政策
  const privacyVisible = ref(false) // 服務條款與隱私政策

  const emailCountdown = ref(0) // 信箱驗證碼倒數計時
  const emailVerified = ref(false) // 信箱驗證結果
  const emailCodeSent = ref(false) // 是否已發送過驗證碼

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

  const fieldTouched = ref({
    username: false,
    email: false,
    password: false,
    fullName: false,
    phone: false,
  })

  // 即時驗證狀態
  const markFieldTouched = (field) => {
    if (field in fieldTouched.value) {
      fieldTouched.value[field] = true
    }
  }

  // 輸入框右側即時小勾勾、叉叉的狀態判斷
  const fieldValidStatus = computed(() => ({
    username: /^[a-zA-Z0-9_]{6,20}$/.test(form.value.username) && !backendErrors.value.username,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email) && !backendErrors.value.email,
    password: form.value.password.length >= 6 && /(?=.*[a-zA-Z])(?=.*\d)/.test(form.value.password),
    confirmPassword:
      !!form.value.confirmPassword && form.value.confirmPassword === form.value.password,
    fullName: form.value.fullName.trim().length >= 2,
    phone: /^09\d{8}$/.test(form.value.phone) && !backendErrors.value.phone,
  }))

  // 發送信箱驗證碼 API
  const handleSendEmailCode = async () => {
    if (!form.value.email) return toast.error('請輸入Email地址')
    if (emailCountdown.value > 0) return

    try {
      await registerForm.value.validateField('email')

      backendErrors.value.email = ''

      const res = await api.sendEmailCode({
        email: form.value.email,
        type: 'REGISTER',
      })

      const code = res.result || (res.data && res.data.result) || res
      if (code) {
        toast.success(`驗證碼已發送至您的信箱`)
        emailCodeSent.value = true
      }

      // 倒數計時
      emailCountdown.value = 60
      const timer = setInterval(() => {
        emailCountdown.value--
        if (emailCountdown.value <= 0) {
          emailCountdown.value = 0
          clearInterval(timer)
        }
      }, 1000)
    } catch (error) {
      const code = error.code
      const message = getMsgByCode(code)

      if (code === ResultCode.EMAIL_IS_EXIST) {
        backendErrors.value.email = message
      } else {
        toast.error('發送驗證碼失敗，請稍後再試')
      }
    }
  }

  // 信箱驗證碼確認 API
  const handleVerifyEmailCode = async () => {
    try {
      await api.verifyEmailCode({
        email: form.value.email,
        code: form.value.emailCode,
        type: 'REGISTER',
      })

      emailVerified.value = true
      emailCountdown.value = 0
      emailCodeSent.value = false
      toast.success('驗證成功')
    } catch (error) {
      emailVerified.value = false
      toast.error('驗證失敗，請確認驗證碼')
    }
  }

  // 帳號欄位驗證
  const validateUsername = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請輸入帳號'))
    } else if (value.length < 6 || value.length > 20) {
      callback(new Error('帳號長度應在 6-20 個字之間'))
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback(new Error('帳號只能包含字母、數字和底線'))
    } else if (backendErrors.value.username) {
      return callback(new Error(backendErrors.value.username))
    }
    callback()
  }

  // Email 欄位驗證
  const validateEmail = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請輸入Email地址'))
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      callback(new Error('請輸入有效的Email地址'))
    } else if (backendErrors.value.email) {
      return callback(new Error(backendErrors.value.email))
    }
    callback()
  }

  // 密碼欄位驗證
  const validatePassword = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請輸入密碼'))
    } else if (value.length < 6) {
      callback(new Error('密碼至少需要 6 個字'))
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
      callback(new Error('密碼必須包含字母和數字'))
    } else {
      callback()
    }
  }

  // 確認密碼欄位驗證
  const validateConfirmPassword = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請確認密碼'))
    } else if (value !== form.value.password) {
      callback(new Error('輸入的密碼不一致'))
    } else {
      callback()
    }
  }

  // 姓名欄位驗證
  const validateFullName = (rule, value, callback) => {
    const fullName = value?.trim() || ''

    if (!fullName) {
      callback(new Error('請輸入姓名'))
    } else if (fullName.length < 2) {
      callback(new Error('姓名至少需要 2 個字'))
    } else {
      callback()
    }
  }

  // 手機號碼欄位驗證
  const validatePhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請輸入手機號碼'))
    } else if (!/^09\d{8}$/.test(value)) {
      callback(new Error('請輸入有效的手機號碼'))
    } else if (backendErrors.value.phone) {
      return callback(new Error(backendErrors.value.phone))
    }
    callback()
  }

  // 服務條款與隱私政策勾選驗證
  const validateTerms = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請同意服務條款和隱私政策'))
    } else {
      callback()
    }
  }

  // 統一打包 Element Plus <el-form :rules="rules"> 讀取的驗證配置表
  const rules = {
    username: [{ validator: validateUsername, required: true, trigger: 'blur' }],
    email: [{ validator: validateEmail, required: true, trigger: 'blur' }],
    password: [{ validator: validatePassword, required: true, trigger: 'blur' }],
    confirmPassword: [{ validator: validateConfirmPassword, required: true, trigger: 'blur' }],
    fullName: [{ validator: validateFullName, required: true, trigger: 'blur' }],
    phone: [{ validator: validatePhone, required: true, trigger: 'blur' }],
    gender: [{ required: true, message: '請選擇性別', trigger: 'change' }],
    birthday: [{ required: true, message: '請選擇生日', trigger: 'change' }],
    emailCode: [
      { required: true, message: '請輸入 6 位數驗證碼', trigger: 'blur' },
      { len: 6, message: '驗證碼長度應為 6 位數', trigger: 'blur' },
    ],
    agreeTerms: [{ validator: validateTerms, trigger: 'change' }],
  }

  // 表單註冊提交
  const handleRegister = async () => {
    if (!registerForm.value) return

    // 每次註冊前先清空舊的重複錯誤
    backendErrors.value.username = ''
    backendErrors.value.email = ''
    backendErrors.value.phone = ''

    if (!emailVerified.value) {
      toast.error('請先完成信箱驗證')
      return
    }

    try {
      const valid = await registerForm.value.validate()
      if (!valid) return

      loading.value = true

      await api.register(form.value)
      toast.success('註冊成功！請登入您的帳號')
      goLogin()
    } catch (error) {
      const code = error.code

      if (!code) {
        toast.error('資料尚未填寫完整，請檢查欄位')
        return
      }

      const message = getMsgByCode(code)

      if (code === ResultCode.ACCOUNT_IS_EXIST) {
        backendErrors.value.username = message // 帳號重複
      } else if (code === ResultCode.EMAIL_IS_EXIST) {
        backendErrors.value.email = message // 信箱重複
      } else {
        toast.error(message)
      }
    } finally {
      loading.value = false
    }
  }

  // 使用者修改 Email 輸入框的文字，立刻重置該信箱的所有驗證狀態
  watch(
    () => form.value.email,
    () => {
      backendErrors.value.email = '' // 清空重複錯誤
      emailVerified.value = false // 重新驗證
      emailCodeSent.value = false // 提示關閉
      form.value.emailCode = '' // 驗證碼欄位清空
    },
  )

  const showTerms = () => {
    termsVisible.value = true
  }

  const showPrivacy = () => {
    privacyVisible.value = true
  }

  const login = () => {
    goLogin()
  }

  return {
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
  }
}
