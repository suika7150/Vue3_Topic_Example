<template>
  <div class="container" :class="{ 'is-mobile': isMobile }">
    <div class="header">
      <h2 class="title">商品管理</h2>
      <div class="header-actions">
        <el-button @click="goTo('AddProduct')" type="primary">
          <el-icon><Plus /></el-icon>
          <span v-if="!isMobile">新增商品</span>
        </el-button>

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
      <el-table
        :data="filteredProducts"
        style="width: 100%"
        stripe
        border
        :size="isMobile ? 'small' : 'default'"
      >
        <el-table-column label="圖片" width="90" align="center">
          <template #default="{ row }">
            <el-image
              :src="API_ROUTES.PRODUCT_IMAGE(row.id)"
              fit="cover"
              style="width: 50px; height: 50px"
              class="img-rounded"
              lazy
              :preview-src-list="[API_ROUTES.PRODUCT_IMAGE(row.id)]"
              preview-teleported
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="商品名稱"
          min-width="150"
          sortable
          show-overflow-tooltip
        />

        <el-table-column v-if="!isMobile" prop="category" label="分類" width="120" />

        <el-table-column prop="price" label="售價" width="100" sortable>
          <template #default="{ row }"> ${{ row.price }} </template>
        </el-table-column>

        <el-table-column prop="stock" label="庫存" width="100" sortable>
          <template #default="{ row }">
            <div class="stock-wrapper">
              <span :class="{ 'text-danger': row.stock <= 5 }">{{ row.stock }}</span>
              <el-tag v-if="row.stock <= 5" type="danger" size="small" effect="dark">低庫存</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column v-if="!isTablet" prop="status" label="狀態" width="100" sortable />

        <el-table-column label="操作" :width="isMobile ? 110 : 180" align="center">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button
                size="small"
                type="primary"
                @click="editProduct(row.id)"
                :circle="isMobile"
              >
                <el-icon><Edit /></el-icon>
                <span v-if="!isMobile">編輯</span>
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteProduct(row.id)"
                :circle="isMobile"
              >
                <el-icon><Delete /></el-icon>
                <span v-if="!isMobile">刪除</span>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/service/api'
import { useNavigation } from '@/composables/useNavigation'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { API_ROUTES } from '@/service/apiRoutes'

const { goTo } = useNavigation()
const { isMobile, isTablet } = useBreakpoint()

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
  goTo('editProduct', { id: productId })
}

const deleteProduct = async (productId) => {
  try {
    await ElMessageBox.confirm('確定要刪除這項商品嗎？', '警告', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await api.deleteProduct(productId)
    if (res.code === '0000') {
      ElMessage.success('刪除成功')
      products.value = products.value.filter((p) => p.id !== productId)
    }
  } catch (err) {}
}

onMounted(async () => {
  try {
    const res = await api.getManageProducts()
    if (res.code === '0000') {
      products.value = res.result
      categories.value = [...new Set(products.value.map((p) => p.category))]
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin: 30px 10px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.select-category {
  width: 160px;
}

.product-table-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: auto;
}

.img-rounded {
  border-radius: 6px;
  cursor: zoom-in;
}

.stock-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.text-danger {
  color: #f56c6c;
  font-weight: bold;
}

.action-btns {
  display: flex;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 1024px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-actions {
    width: 100%;
  }
  .select-category {
    flex: 1;
  }
}
</style>
