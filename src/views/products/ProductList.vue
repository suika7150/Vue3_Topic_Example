<template>
  <div class="product-list-container">
    <div class="breadcrumb-strip">
      <Breadcrumb />
    </div>
    <template v-if="isLoading">
      <div class="product-list-header">
        <h2 class="header-title">正在載入商品...</h2>
      </div>
      <el-row :gutter="20">
        <el-col v-for="i in 4" :key="i" :span="6" class="product-col">
          <el-skeleton animated :rows="5" />
        </el-col>
      </el-row>
    </template>

    <template v-else-if="filteredProducts.length > 0">
      <div class="product-list-header">
        <h2 class="header-title">商品列表</h2>
        <div class="header-controls">
          <!-- <div class="breadcrumb-bar">
            <Breadcrumb />
          </div> -->
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
          <el-button @click="openCartDrawer" type="primary">購物車</el-button>
        </div>
      </div>

      <el-row :gutter="20">
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
                  class="card-image"
                  @error="handleImageError"
                />
              </el-tooltip>
            </div>
            <div class="card-body">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <el-rate v-model="product.rating" disabled show-score :max="5" />
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
        <div v-if="isLoadMoreLoading" class="loading-indicator">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>載入中...</span>
        </div>
        <el-button v-else-if="visibleCount < filteredProducts.length" @click="loadMore" plain>
          載入更多
        </el-button>
      </div>
    </template>

    <div v-else class="empty-state">
      <el-empty description="哎呀！找不到相關商品" :image-size="300">
        <el-button type="primary" @click="clearSearch">返回顯示所有商品</el-button>
      </el-empty>
    </div>

    <el-dialog v-model="dialogVisible" :title="currentProduct.name" width="1000px">
      <div v-if="currentProduct" class="product-detail-dialog">
        <img :src="currentProduct.imageBase64" class="product-detail-image" />
        <div class="product-detail-content">
          <p class="detail-price">$ {{ currentProduct.price }}</p>
          <p class="detail-description">{{ currentProduct.description }}</p>
          <el-rate v-model="currentProduct.rating" disabled show-score :max="5" />
        </div>
      </div>
    </el-dialog>
    <CartDrawer v-model:drawerVisible="drawerVisible" />
  </div>
</template>

<script setup>
import CartDrawer from '@/components/CartDrawer.vue'
import Breadcrumb from '@/Navigation/Breadcrumb.vue'
import { useNavigation } from '@/composables/useNavigation'
import api from '@/service/api'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/store/cartStore'
import Storage, { CART_KEY } from '@/utils/storageUtil'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { watch } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import throttle from 'lodash/throttle'
import { Loading } from '@element-plus/icons-vue'

const cartStore = useCartStore()
const products = ref([])
const categories = ref([])
const isLoading = ref(true)
const loadMoreCount = 4
const visibleCount = ref(loadMoreCount)
const isLoadMoreLoading = ref(false)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const currentProduct = ref({})
const route = useRoute()
const { goProducts } = useNavigation()

const props = defineProps({
  forcedCategory: {
    type: String,
    default: '',
  },
})

const fetchProducts = async () => {
  isLoading.value = true
  try {
    // 這裡就是從網址抓關鍵字的地方
    const currentKeyword = route.query.keyword

    // 呼叫後端 API
    const res = await api.getProducts({ keyword: currentKeyword || undefined })

    if (res.code === '0000') {
      products.value = res.result
      visibleCount.value = loadMoreCount // 搜尋後重置載入筆數

      //如果正在搜尋，就手動把分類下拉選單清空
      if (currentKeyword) {
        selectedCategory.value = ''
      }
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.query.keyword,
  () => {
    fetchProducts() // 只要網址 keyword 變了，就去後端撈新資料
  },
)
const selectedCategory = ref(props.forcedCategory || '')

watch(
  () => props.forcedCategory,
  (newVal) => {
    selectedCategory.value = newVal || ''
    visibleCount.value = loadMoreCount
  },
)

onMounted(async () => {
  await fetchProducts()

  if (products.value.length > 0 && categories.value.length === 0) {
    categories.value = [...new Set(products.value.map((p) => p.category))]
  }

  if (props.forcedCategory) {
    selectedCategory.value = props.forcedCategory
  }

  Storage.get(CART_KEY)
  window.addEventListener('scroll', handleScrollThrottled)
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

const clearSearch = () => {
  selectedCategory.value = ''
  visibleCount.value = loadMoreCount
  goProducts()
}
</script>

<style scoped>
.product-list-container {
  max-width: 1500px;
  padding: 100px;
}

.breadcrumb-strip {
  /* 增加與下方「商品列表」標題的距離 */
  margin-bottom: 10px;

  /* 如果你想要麵包屑本身也有點內距，看起來更像一個獨立區塊 */
  padding: 10px 0;
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
  height: 200px;
  overflow: hidden;
  cursor: pointer;
  background-color: #f5f7fa;
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
