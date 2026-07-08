import { ref, computed, watch } from 'vue'
import api from '@/services/api'
import { ResultCode, getMsgByCode } from '@/utils/resultCode'
import { toast } from '@/utils/message'
import { useNavigation } from '@/composables/useNavigation'

export function useRegister() {
  const { goLogin } = useNavigation()

  const registerForm = ref()
  const loading = ref(false)

  const termsVisible = ref(false)
  const privacyVisible = ref(false)

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
    confirmPassword: false,
    fullName: false,
    phone: false,
  })

  // 即時驗證狀態
  const markFieldTouched = (field) => {
    if (field in fieldTouched.value) {
      fieldTouched.value[field] = true
    }
  }

  const fieldValidStatus = computed(() => ({
    username: /^[a-zA-Z0-9_]{3,20}$/.test(form.value.username) && !backendErrors.value.username,

    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email) && !backendErrors.value.email,

    password: form.value.password.length >= 6 && /(?=.*[a-zA-Z])(?=.*\d)/.test(form.value.password),

    confirmPassword:
      !!form.value.confirmPassword && form.value.confirmPassword === form.value.password,

    fullName: form.value.fullName.trim().length >= 2,

    phone: /^09\d{8}$/.test(form.value.phone) && !backendErrors.value.phone,
  }))

  // 信箱驗證碼
  const handleSendEmailCode = async () => {
    if (!form.value.email) return toast.error('請輸入Email地址')
    if (emailCountdown.value > 0) return

    try {
      // 僅驗證 Email 欄位，格式正確才發送 API
      await registerForm.value.validateField('email')

      // 先清空舊的後端錯誤訊息
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
        toast.error('發送驗證碼失敗，請稍後再試。')
      }
    }
  }

  // 信箱驗證
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

  // 自定義驗證規則
  const validateUsername = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請輸入帳號'))
    } else if (value.length < 3 || value.length > 20) {
      callback(new Error('帳號長度應在3-20個字符之間'))
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback(new Error('帳號只能包含字母、數字和下劃線'))
    } else if (backendErrors.value.username) {
      return callback(new Error(backendErrors.value.username))
    }
    callback()
  }

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
      callback(new Error('輸入的密碼不一致'))
    } else {
      callback()
    }
  }

  const validateFullName = (rule, value, callback) => {
    const fullName = value?.trim() || ''

    if (!fullName) {
      callback(new Error('請輸入姓名'))
    } else if (fullName.length < 2) {
      callback(new Error('姓名至少需要2個字'))
    } else {
      callback()
    }
  }

  const validatePhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('請輸入手機號碼'))
    } else if (!/^09\d{8}$/.test(value)) {
      callback(new Error('請輸入有效的台灣手機號碼'))
    } else if (backendErrors.value.phone) {
      return callback(new Error(backendErrors.value.phone))
    }
    callback()
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
    fullName: [{ validator: validateFullName, required: true, trigger: 'blur' }],
    phone: [{ validator: validatePhone, required: true, trigger: 'blur' }],
    gender: [{ required: true, message: '請選擇性別', trigger: 'change' }],
    birthday: [{ required: true, message: '請選擇生日', trigger: 'change' }],
    emailCode: [
      { required: true, message: '請輸入6位驗證碼', trigger: 'blur' },
      { len: 6, message: '驗證碼長度應為 6 位', trigger: 'blur' },
    ],
    agreeTerms: [{ validator: validateTerms, trigger: 'change' }],
  }

  const handleRegister = async () => {
    if (!registerForm.value) return

    // 每次註冊前先清空舊的後端錯誤
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
      const message = getMsgByCode(code)

      // 根據 code 分流顯示錯誤
      if (code === ResultCode.ACCOUNT_IS_EXIST) {
        backendErrors.value.username = message // 帳號重複，紅字噴在帳號欄
      } else if (code === ResultCode.EMAIL_IS_EXIST) {
        backendErrors.value.email = message // Email 重複，紅字噴在 Email 欄
      } else {
        toast.error(message)
      }
    } finally {
      loading.value = false
    }
  }

  watch(
    () => form.value.email,
    () => {
      backendErrors.value.email = ''
      emailVerified.value = false
      emailCodeSent.value = false
      form.value.emailCode = ''
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
