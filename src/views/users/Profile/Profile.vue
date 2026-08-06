<template>
  <div class="profile-page">
    <el-card class="profile-card" shadow="never">
      <div class="profile-card__header">
        <h2 class="title">個人資料</h2>
      </div>

      <el-form
        :model="form"
        :rules="rules"
        ref="profileForm"
        label-position="top"
        class="profile-form"
      >
        <!-- 帳號 -->
        <el-form-item label="帳號">
          <div class="profile-form__readonly-user">
            <el-icon><User /></el-icon>
            <span>{{ form.username }}</span>
          </div>
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="請輸入Email地址" clearable />
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="請輸入真實姓名" clearable />
        </el-form-item>

        <!-- 手機號碼 -->
        <el-form-item label="手機號碼" prop="phone">
          <el-input v-model="form.phone" placeholder="請輸入手機號碼" clearable />
        </el-form-item>

        <!-- 性別 -->
        <el-form-item label="性別" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio value="M">男</el-radio>
            <el-radio value="F">女</el-radio>
            <el-radio value="O">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 生日 -->
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="選擇生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 更新按鈕 -->
        <el-form-item class="profile-form__action">
          <el-button
            type="button"
            class="app-btn app-btn--primary app-btn--block"
            :loading="loading"
            @click="handleUpdate"
          >
            <span v-if="loading" class="app-btn__spinner"></span>
            <span>{{ loading ? '更新中' : '更新資料' }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import api from '@/services/api'
import { useNavigation } from '@/composables/useNavigation'
import { useUserStore } from '@/store/userStore'

const { goLogin } = useNavigation()
const profileForm = ref()
const loading = ref(false)
const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  fullName: '',
  phone: '',
  gender: '',
  birthday: '',
})

onMounted(async () => {
  try {
    const res = await api.user()
    if (res && res.result) {
      form.value = { ...form.value, ...res.result }
    }
  } catch (error) {
    ElMessage.error('載入個人資料失敗，請重新登入')
  }
})

const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入Email地址'))
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('請輸入有效的Email地址'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('請輸入手機號碼'))
  } else if (!/^09\d{8}$/.test(value)) {
    callback(new Error('請輸入有效的手機號碼'))
  } else {
    callback()
  }
}

const rules = {
  email: [{ validator: validateEmail, trigger: 'blur' }],
  fullName: [
    { required: false, message: '請輸入姓名', trigger: 'blur' },
    { min: 2, message: '姓名至少需要2個字符', trigger: 'blur' },
  ],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  gender: [{ required: true, message: '請選擇性別', trigger: 'change' }],
  birthday: [{ required: true, message: '請選擇生日', trigger: 'change' }],
}

const handleUpdate = async () => {
  if (!profileForm.value) return

  try {
    const valid = await profileForm.value.validate()
    if (!valid) return

    loading.value = true
    await api.updateProfile({ ...form.value })

    userStore.updateUserInfo({
      fullName: form.value.fullName,
    })

    ElMessage.success('資料更新成功！')
  } catch (err) {
    ElMessage.error(err.message || '更新失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '@/views/users/Profile/Profile.scss';
</style>
