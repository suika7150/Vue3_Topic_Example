<template>
  <div class="product-list-container">
    <div class="product-list-header">
      <h2 class="header-title">商品列表</h2>
      <div class="header-controls">
        <el-select
          v-model="selectedCategory"
          placeholder="選擇分類"
          clearable
          class="category-select"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
        <el-button @click="openCartDrawer" type="primary" class="openCartDrawer">
          購物車
        </el-button>
      </div>
    </div>

    <el-row v-if="isLoading" :gutter="20">
      <el-col v-for="i in 4" :key="i" :span="6" class="product-col">
        <el-skeleton animated :rows="5" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20">
      <el-col
        v-for="product in visibleProducts"
        :key="product.id"
        :span="6"
        :xs="12"
        :sm="12"
        :md="8"
        :lg="6"
        class="product-col"
      >
        <el-card shadow="hover" class="product-card">
          <div class="card-image-wrapper" @click="showProductDetail(product)">
            <el-tooltip :content="product.description" placement="top">
              <img
                :src="product.imageBase64"
                loading="lazy"
                alt="product image"
                class="card-image"
                @error="handleImageError"
              />
            </el-tooltip>
          </div>

          <div class="card-body">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <el-rate v-model="product.rating" disabled show-score :max="5" class="product-rating" />
            <p class="product-price">$ {{ product.price }}</p>

            <el-button
              type="primary"
              size="small"
              class="add-to-cart-button"
              @click="addToCart(product)"
            >
              加入購物車
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="load-more-container">
      <!-- 旋轉圖示 -->
      <div v-if="isLoadMoreLoading" class="loading-indicator">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>載入中...</span>
      </div>

      <!-- 當還有更多商品且未在載入時，才顯示按鈕 -->
      <el-button v-else-if="visibleCount < filteredProducts.length" @click="loadMore" plain>
        載入更多
      </el-button>
    </div>

    <el-dialog v-model="dialogVisible" :title="currentProduct.name" width="1000px">
      <div v-if="currentProduct" class="product-detail-dialog">
        <img :src="currentProduct.imageBase64" alt="product image" class="product-detail-image" />
        <div class="product-detail-content">
          <p class="detail-price">$ {{ currentProduct.price }}</p>
          <p class="detail-description">{{ currentProduct.description }}</p>
          <el-rate
            v-model="currentProduct.rating"
            disabled
            show-score
            :max="5"
            class="detail-rating"
          />
        </div>
      </div>
    </el-dialog>
    <CartDrawer v-model:drawerVisible="drawerVisible" />
  </div>
  <!-- <div v-for="product in products" :key="product.id"></div> -->
</template>

<script setup>
import CartDrawer from '@/components/CartDrawer.vue'
import api from '@/service/api'
import { useCartStore } from '@/store/cartStore'
import Storage, { CART_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { watch } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import throttle from 'lodash/throttle' // 引入 lodash 的 throttle 函數控制載入商品的頻率

const cartStore = useCartStore()
import { Loading } from '@element-plus/icons-vue'
const products = ref([])
const categories = ref([])
const isLoading = ref(true)
const loadMoreCount = 4
const visibleCount = ref(loadMoreCount)
const isLoadMoreLoading = ref(false)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const currentProduct = ref({})

const props = defineProps({
  forcedCategory: {
    type: String,
    default: '',
  },
})

const selectedCategory = ref(props.forcedCategory || '')

watch(
  () => props.forcedCategory,
  (newVal) => {
    selectedCategory.value = newVal || ''
    visibleCount.value = loadMoreCount
  },
)

onMounted(async () => {
  isLoading.value = true
  try {
    const res = await api.getProducts()
    if (res.code === '0000') {
      products.value = res.result
      categories.value = [...new Set(products.value.map((p) => p.category))]
    }
    if (props.forcedCategory) {
      selectedCategory.value = props.forcedCategory
    }
  } catch (err) {
    console.error('載入商品失敗:', err)
  } finally {
    isLoading.value = false
  }

  Storage.get(CART_KEY)

  //自動載入更多商品
  window.addEventListener('scroll', handleScrollThrottled)

  loadMore()
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/300x200?text=無法載入'
}

const loadMore = () => {
  if (isLoadMoreLoading.value) return // 如果正在載入，則不執行

  isLoadMoreLoading.value = true

  // 模擬網路延遲，讓使用者能看到載入動畫
  setTimeout(() => {
    visibleCount.value += loadMoreCount
    isLoadMoreLoading.value = false
  }, 1500) // 延遲 1.5 秒
}

//自動載入更多商品
function handleScroll() {
  const scrolly = window.scrollY
  const visibleHeight = window.innerHeight
  const pageHeight = document.documentElement.scrollHeight

  // 檢查是否接近底部 (距離底部 < 100px)
  if (scrolly + visibleHeight >= pageHeight - 200) {
    if (visibleCount.value < products.value.length) {
      loadMore()
    }
  }
}

const handleScrollThrottled = throttle(handleScroll, 500)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScrollThrottled)
})

const filteredProducts = computed(() => {
  const filtered = selectedCategory.value
    ? products.value.filter((p) => p.category === selectedCategory.value)
    : products.value
  return filtered
})

const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))

const showProductDetail = (product) => {
  currentProduct.value = product
  dialogVisible.value = true
}

const addToCart = (product) => {
  const existingItem = cartStore.cart.find((item) => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += 1
    ElMessage.success(`${product.name} 數量已更新為 ${existingItem.quantity}`)
  } else {
    cartStore.addProduct(product)
    ElMessage.success(`${product.name} 已加入購物車`)
  }
  drawerVisible.value = true
}

const openCartDrawer = () => {
  drawerVisible.value = true
}
</script>

<style scoped>
.product-list-container {
  max-width: 1500px;
  padding: 100px;
}

.product-col {
  margin-bottom: 50px;
}

.product-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
}

.header-controls {
  display: flex;
  align-items: center;
}

.category-select {
  width: 160px;
  margin-right: 16px;
}

.product-card :deep(.el-card__body) {
  padding: 0px;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 16px;
  background-color: #fff;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-category {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.product-rating {
  margin-bottom: 8px;
}

.product-price {
  color: #dc2626;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.add-to-cart-button {
  width: 100%;
}

.load-more-container {
  padding: 20px 0;
  text-align: center;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.product-detail-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-detail-image {
  width: 100%;
  margin-bottom: 16px;
  border-radius: 4px;
  max-width: 448px;
}

.product-detail-content {
  padding: 8px;
  text-align: center;
}

.detail-price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.detail-description {
  color: #4b5563;
  margin-bottom: 16px;
}

.detail-rating {
  margin-bottom: 8px;
  justify-content: center;
}

@media (max-width: 912px) {
  .product-list-container {
    max-width: 1200px;
    padding: 20px;
  }
}
</style>
