<template>
  <div class="container">
    <div class="header">
      <h2 class="title">商品管理</h2>
      <div class="header-actions">
        <el-button @click="goTo('AddProduct')" type="primary"> + 新增商品 </el-button>

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

    <div class="product-table-container">
      <el-table :data="filteredProducts" style="width: 100%" stripe border>
        <el-table-column label="圖片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.imageBase64"
              fit="cover"
              style="width: 60px; height: 60px"
              class="img-rounded"
              lazy
            >
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名稱" sortable show-overflow-tooltip />

        <el-table-column prop="category" label="分類" width="120" />

        <el-table-column prop="price" label="售價" width="100" sortable>
          <template #default="{ row }"> ${{ row.price }} </template>
        </el-table-column>

        <el-table-column prop="stock" label="庫存" width="100" sortable>
          <template #default="{ row }">
            <div class="stock-wrapper">
              <span class="stock-text">{{ row.stock }}</span>
              <p v-if="row.stock <= 5" class="stock-warning">庫存緊張</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="states" label="狀態" width="100" sortable>
          <template #default="{ row }"> {{ row.states }} </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editProduct(row.id)"> 編輯 </el-button>
            <el-button size="small" type="danger" @click="deleteProduct(row.id)"> 刪除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

const { goTo } = useNavigation()

const products = ref([])
const categories = ref([])
const selectedCategory = ref('')
const isLoading = ref(true)

const filteredProducts = computed(() => {
  return selectedCategory.value
    ? products.value.filter((p) => p.category === selectedCategory.value)
    : products.value
})

const editProduct = (productId) => {
  goTo('EditProduct', { id: productId })
}

const deleteProduct = async (productId) => {
  try {
    await ElMessageBox.confirm('確定要刪除這項商品嗎？此操作無法復原。', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await api.deleteProduct(productId)
    if (res.code === '0000') {
      ElMessage.success('商品刪除成功！')

      //更新該筆資料
      const index = products.value.findIndex((p) => p.id === res.result.id)
      if (index !== -1) {
        products.value.splice(index, 1, res.result)
      }
    }
  } catch (err) {
    if (err !== 'cancel') {
      console.error('刪除商品失敗:', err)
      ElMessage.error('刪除商品失敗，請稍後再試。')
    }
  }
}

onMounted(async () => {
  try {
    const res = await api.getManageProducts()
    if (res.code === '0000') {
      products.value = res.result
      categories.value = [...new Set(products.value.map((p) => p.category))]
    }
  } catch (err) {
    console.error('載入商品失敗:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px 16px;
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

.product-table-container {
  overflow-x: auto;
}

.img-rounded {
  border-radius: 8px;
}

.stock-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stock-text {
  font-size: 14px;
}

.stock-warning {
  font-size: 12px;
  color: red;
  margin-top: 4px;
}

/* 深層選擇器修改 Element Plus 元件樣式 */
::v-deep(.el-input-number.el-input-number--small) {
  width: 90px;
}

::v-deep(.el-input-number.el-input-number--small .el-input__inner) {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

::v-deep(.el-input-number.el-input-number--small .el-input-number__decrease),
::v-deep(.el-input-number.el-input-number--small .el-input-number__increase) {
  height: 24px;
  width: 24px;
}
</style>
