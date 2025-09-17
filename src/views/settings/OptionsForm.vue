<template>
  <h2>{{ mode === 'add' ? '新增選項' : '編輯選項' }}</h2>
  <el-form
    ref="optionFormRef"
    :model="optionForm"
    :rules="rules"
    label-width="120px"
    class="option-form"
  >
    <el-form-item label="分類名稱" prop="listName">
      <el-input v-model="optionForm.listName" placeholder="例如: order_status" />
    </el-form-item>

    <el-form-item label="選項名稱" prop="name">
      <el-input v-model="optionForm.name" placeholder="例如: 銷售中" />
    </el-form-item>

    <el-form-item label="選項值" prop="value">
      <el-input v-model="optionForm.value" placeholder="例如: 0" />
    </el-form-item>

    <el-form-item label="排序" prop="sortOrder">
      <el-input-number v-model="optionForm.sortOrder" :min="0" controls-position="right" />
    </el-form-item>

    <el-form-item label="是否啟用" prop="isActive">
      <el-switch v-model="optionForm.isActive" />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="optionForm.description"
        type="textarea"
        :rows="2"
        placeholder="輸入選項描述"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(optionFormRef)">
        {{ mode === 'add' ? '新增' : '更新' }}
      </el-button>
      <el-button @click="resetForm(optionFormRef)"> 重置 </el-button>
      <el-button type="success" @click="closeForm()">關閉</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import api from '@/service/api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
})

const emits = defineEmits(['submit', 'close'])

const optionFormRef = ref(null)

// 表單資料，使用 reactive 創建響應式物件
const optionForm = reactive({
  listName: '',
  name: '',
  value: '',
  sortOrder: 0,
  isActive: true,
  description: '',
})

// 表單驗證規則
const rules = reactive({
  listName: [
    { required: true, message: '請輸入列表名稱', trigger: 'blur' },
    { min: 3, max: 50, message: '長度需介於 3 到 50 個字元', trigger: 'blur' },
  ],
  name: [{ required: true, message: '請輸入選項名稱', trigger: 'blur' }],
  value: [{ required: true, message: '請輸入選項值', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '請輸入排序值', trigger: 'change' }],
})

watch(
  () => props.option,
  (newOption) => {
    Object.assign(optionForm, newOption)
  },
  { deep: true, immediate: true },
)

// 提交表單的函式
const submitForm = async (formEl) => {
  // 如果表單實例不存在，則直接返回
  if (!formEl) return

  // 觸發表單驗證
  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      // 驗證失敗
      console.log('表單驗證失敗！', fields)
      ElMessage({
        message: '請檢查表單內容是否有誤。',
        type: 'error',
      })
      return
    }

    try {
      if (props.mode === 'add') {
        await api.addOption(optionForm)
        ElMessage({
          message: '選項新增成功！',
          type: 'success',
        })
        emits('submit')
      } else {
        await api.updateOption(optionForm.id, optionForm)
        ElMessage({
          message: '選項更新成功！',
          type: 'success',
        })
        emits('submit')
      }
      // optionFormRef.value.resetFields()
    } catch (error) {
      ElMessage({
        message: `選項${props.mode === 'add' ? '新增' : '更新'}失敗 : ${error}`,
        type: 'error',
      })
    }
  })
}

// 重置表單的函式
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields() // 重置所有表單項
}

const closeForm = () => {
  emits('close')
}
</script>

<style scoped></style>
