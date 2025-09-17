<template>
  <div class="container">
    <div class="header">
      <h2 class="title">選項管理</h2>
      <div class="header-actions">
        <el-button @click="addOption()" type="primary"> + 新增項目 </el-button>

        <el-select
          v-model="selectedCategory"
          placeholder="選擇分類"
          clearable
          class="select-category"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
      </div>
    </div>

    <OptionsForm
      v-if="showAddOptionForm"
      :option="optionForm"
      :mode="mode"
      @submit="handlesubmit()"
      @close="handleClose()"
    />

    <el-table :data="filteredProducts" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="listName" label="分類名稱" width="180" />
      <el-table-column prop="key" label="選項名稱" />
      <el-table-column prop="value" label="選項值" />
      <el-table-column prop="sortOrder" label="排序" sortable />
      <el-table-column prop="isActive" label="啟用狀態">
        <template #default="{ row }">
          <el-icon v-if="row.isActive" style="color: var(--el-color-success)"><Open /></el-icon>
          <el-icon v-else style="color: var(--el-color-danger)"><Close /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="editOption(row)"> 編輯 </el-button>
          <el-button size="small" type="danger" @click="deleteOption(row.id)"> 刪除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, handleError } from 'vue'
import api from '@/service/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Open, Close } from '@element-plus/icons-vue'
import { useNavigation } from '@/composables/useNavigation'
import OptionsForm from './OptionsForm.vue'
const { goTo } = useNavigation()

const tableData = ref([])
const categories = ref([])
const selectedCategory = ref('')
const showAddOptionForm = ref(false)
const optionForm = reactive({})
const mode = ref('')
const filteredProducts = computed(() => {
  return selectedCategory.value
    ? tableData.value.filter((p) => p.listName === selectedCategory.value)
    : tableData.value
})

const addOption = () => {
  showAddOptionForm.value = true
  Object.assign(optionForm, {
    listName: '',
    name: '',
    value: '',
    sortOrder: 0,
    isActive: true,
    description: '',
  })
  mode.value = 'add'
}

const editOption = (option) => {
  Object.assign(optionForm, { ...option, name: option.key })
  showAddOptionForm.value = true
  mode.value = 'edit'
  selectedCategory.value = option.listName
}

const handlesubmit = () => {
  showAddOptionForm.value = false
  loadOptions()
  selectedCategory.value = ''
}

const handleClose = () => {
  showAddOptionForm.value = false
  selectedCategory.value = ''
}

const deleteOption = async (optionId) => {
  try {
    await ElMessageBox.confirm('確定要刪除這選項嗎？此操作無法復原。', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await api.deleteOption(optionId)
    if (res.code === '0000') {
      ElMessage.success('選項刪除成功！')

      loadOptions()
    }
  } catch (err) {
    if (err !== 'cancel') {
      console.error('刪除商品失敗:', err)
      ElMessage.error('刪除商品失敗，請稍後再試。')
    }
  }
}

// 載入選項
const loadOptions = async () => {
  try {
    const res = await api.getOptions()
    if (res.code === '0000') {
      tableData.value = res.result
      categories.value = [...new Set(tableData.value.map((p) => p.listName))]
    }
  } catch (err) {
    ElMessage.error('載入商品失敗')
  }
}

onMounted(async () => {
  loadOptions()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.header-actions {
  display: flex;
  align-items: center;
}

.select-category {
  margin-left: 16px;
  width: 160px;
}
</style>
