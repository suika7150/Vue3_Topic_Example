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
          <el-card class="product-card">
            <div class="card-image-wrapper" @click="showProductDetail(product)">
              <!-- <el-tooltip :content="product.description" placement="bottom"> -->
              <img
                :src="product.imageBase64"
                loading="lazy"
                class="card-image"
                @error="handleImageError"
              />
              <!-- </el-tooltip> -->
            </div>
            <div class="card-body">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <el-rate v-model="product.rating" disabled show-score :max="5" />
              <div class="price-action-row">
                <p class="product-price">$ {{ product.price }}</p>
                <div
                  class="wishlist-icon"
                  :class="{ 'is-active': product.isWishlisted }"
                  @click.stop="toggleWishlist(product)"
                >
                  <el-icon><Star v-if="!product.isWishlisted" /><StarFilled v-else /></el-icon>
                </div>
              </div>
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
import { toast } from '@/utils/message'
import { computed, ref } from 'vue'
import { watch } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import throttle from 'lodash/throttle'
import { Loading, Star, StarFilled } from '@element-plus/icons-vue'

const route = useRoute()
const { goProducts } = useNavigation()
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
    toast.success(`${product.name} 數量已更新為 ${existingItem.quantity}`)
  } else {
    cartStore.addProduct(product)
    toast.success(`${product.name} 已加入購物車`)
  }
  drawerVisible.value = true
}

const toggleWishlist = (product) => {
  // 切換狀態 (實際開發時這裡會呼叫後端 API)
  product.isWishlisted = !product.isWishlisted

  if (product.isWishlisted) {
    toast.success('已加入追蹤清單')
  } else {
    toast.info('已從追蹤清單移除')
  }
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
  max-width: 1400px;
  padding: 60px 20px;
}

.breadcrumb-strip {
  margin-bottom: 20px;
}
.product-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.header-controls {
  display: flex;
  align-items: center;
}
.product-col {
  margin-bottom: 40px;
  max-width: 25%;
  box-sizing: border-box;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
}

.category-select {
  width: 180px;
  margin-right: 12px;
}

.product-card {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 懸浮效果 */
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
}

.product-card :deep(.el-card__body) {
  padding: 0;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background-color: #f5f5f7;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

/* 圖片放大效果 */
.product-card:hover .card-image {
  transform: scale(1.08);
}

.card-body {
  padding: 20px;
  text-align: left;
}

.product-category {
  font-size: 12px;
  text-transform: uppercase;
  color: #86868b;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.product-name {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
  line-height: 1.4;
  /* 標題限制兩行，保持高度整齊 */
  display: -webkit-box;
  /* -webkit-line-clamp: 1; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

/* 價格與按鈕 */
.price-action-row {
  display: flex;
  justify-content: space-between; /* 價格靠左，追蹤靠右 */
  align-items: center;
  margin: 12px 0;
}

/* 星星按鈕樣式 */
.wishlist-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c7c7cc;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 4px;
  font-size: 25px;
}

/* 懸浮時變色 */
.wishlist-icon:hover {
  transform: scale(1.2);
  color: #ffb800;
}

/* 星星點擊後 (變成金色) */
.wishlist-icon.is-active {
  color: #ffb800 !important;
  animation: starBounce 0.4s ease;
}

/* 星星彈跳動畫 */
@keyframes starBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}

/* 確保價格文字不會擠到星星 */
.product-price {
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

/* 按鈕 */
.add-to-cart-button {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  font-weight: 500;
  border: none;
  background: #0071e3;
  transition: background 0.3s ease;
}

.add-to-cart-button:hover {
  background: #0077ed;
}

.load-more-container {
  margin-top: 40px;
  text-align: center;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #86868b;
}

.product-detail-dialog {
  display: flex;
  gap: 30px;
  padding: 20px;
}

.product-detail-image {
  flex: 1;
  max-width: 50%;
  border-radius: 12px;
  object-fit: cover;
}

.product-detail-content {
  flex: 1;
  text-align: left;
}

.detail-price {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.detail-description {
  font-size: 16px;
  line-height: 1.6;
  color: #424245;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .product-list-container {
    padding: 20px 15px;
  }
  .card-image-wrapper {
    height: 180px;
  }
  .product-detail-dialog {
    flex-direction: column;
  }
  .product-detail-image {
    max-width: 100%;
  }
  .product-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>
