<template>
  <div class="profile-container">
    <el-card class="profile-card" shadow="never">
      <div class="profile-header">
        <h2 class="title">個人資料維護</h2>
      </div>

      <el-form :model="form" :rules="rules" ref="profileForm" label-position="top">
        <el-form-item label="帳號">
          <el-input v-model="form.username" disabled />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="請輸入Email地址" clearable />
        </el-form-item>

        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="請輸入真實姓名" clearable />
        </el-form-item>

        <el-form-item label="手機號碼" prop="phone">
          <el-input v-model="form.phone" placeholder="請輸入手機號碼" clearable />
        </el-form-item>

        <el-form-item class="update-section">
          <el-button class="profile-btn" @click="handleUpdate" :loading="loading">
            更新資料
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import Storage, { TOKEN_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const { goLogin } = useNavigation()
const profileForm = ref()
const loading = ref(false)

const form = ref({
  username: '',
  email: '',
  fullName: '',
  phone: '',
})

onMounted(async () => {
  const token = Storage.get(TOKEN_KEY)

  if (!token) {
    ElMessage.error('請先登入')
    goLogin()
    return
  }

  try {
    const res = await api.findUser()
    if (res && res.result) {
      form.value = { ...form.value, ...res.result }
    }
  } catch (error) {
    ElMessage.error('獲取資料失敗')
  }
})

// 驗證規則 (同步 Register.vue 的邏輯)
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
    callback(new Error('請輸入有效的台灣手機號碼'))
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
}

const handleUpdate = async () => {
  if (!profileForm.value) return

  try {
    const valid = await profileForm.value.validate()
    if (!valid) return

    loading.value = true
    await api.updateProfile({ ...form.value })
    ElMessage.success('資料更新成功！')
  } catch (err) {
    ElMessage.error(err.message || '更新失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f9f9f9;
}

.profile-card {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  background: white;
}

.profile-header {
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

.el-form-item {
  margin-bottom: 25px;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  padding-left: 5px;
  padding-right: 5px;
  transition: border-color 0.3s ease;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-input__wrapper:hover) {
  border-bottom: 1px solid #000;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  border-bottom: 1px dashed #dcdfe6;
  background-color: transparent;
  cursor: not-allowed;
}

/** 輸入框內容 */
:deep(.el-input__inner) {
  font-size: 16px;
  font-weight: 500;
  color: #000;
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

.update-section {
  margin-top: 40px;
}

.profile-btn {
  font-size: 16px;
  height: 44px;
  width: 100%;
  border-radius: 8px;
  background-color: black;
  color: white;
  border: none;
  padding: 8px 12px;
  transition: opacity 0.3s;
}

.profile-btn:hover {
  background-color: #333;
  color: white;
  opacity: 0.9;
}

:deep(.el-form-item.is-error) .el-input__wrapper {
  box-shadow: none !important;
}

@media (max-width: 768px) {
  .profile-card {
    padding: 20px;
  }
  .title {
    font-size: 24px;
  }
}
</style>
