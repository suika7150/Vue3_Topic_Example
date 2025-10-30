<template>
  <el-drawer
    :model-value="drawerVisible"
    @update:model-value="emit('update:drawerVisible', $event)"
    title="🛒 購物車內容"
    :size="'35%'"
    @close="handleClose"
  >
    <div v-if="cart.length" class="cart-content">
      <el-table :data="cart" style="width: 100%">
        <el-table-column label="操作" width="60">
          <template #default="scope">
            <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              size="small"
              @click="removeItem(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品" width="80">
          <template #default="scope">
            <el-image
              :src="scope.row.imageBase64"
              style="width: 50px; height: 50px; border-radius: 4px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="名稱" min-width="80" max-width="150">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="價格" width="80">
          <template #default="scope">
            <span class="cart-price">${{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="數量" width="132">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.quantity"
              :min="1"
              size="small"
              @change="(e) => handleQuantityChange(e, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="小計" width="80">
          <template #default="scope">
            <span class="cart-price">${{ scope.row.price * scope.row.quantity }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-empty v-else description="購物車目前是空的" />

    <template #footer>
      <div class="cart-footer">
        <div class="cart-total-row">
          <p class="cart-total-label">總計:</p>
          <p class="cart-total-amount">${{ cartStore.totalPrice }}</p>
        </div>

        <el-button
          type="primary"
          class="cart-checkout-btn"
          size="large"
          :disabled="!cart.length"
          @click="handleCheckout"
        >
          <el-icon class="cart-checkout-icon"><ShoppingCart /></el-icon>
          前往結帳 ({{ cartStore.totalQuantity }} 件商品)
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { useCartStore } from '@/store/cartStore'
import { Delete, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from 'vue'

const { goTo } = useNavigation()
const cartStore = useCartStore()
const cart = computed(() => cartStore.cart)

const props = defineProps({
  drawerVisible: { type: Boolean, required: true },
})

const emit = defineEmits(['update:drawerVisible', 'removeItem'])

const handleClose = () => {
  emit('update:drawerVisible', false)
}

const handleQuantityChange = (e, product) => {
  ElMessage.success(`${product.name} 數量已更新為 ${e}`)
}

const createCheckoutConfirmContent = () => {
  const itemsHtml = cart.value
    .map(
      (item) =>
        `<div style="display: flex; justify-content: space-between; margin: 5px 0;">
      <span>${item.name} × ${item.quantity}</span>
      <span style="font-weight: bold;">$${item.price * item.quantity}</span>
    </div>`,
    )
    .join('')

  return `
    <div style="max-height: 200px; overflow-y: auto;">
      <p style="margin-bottom: 10px; font-weight: bold;">購買商品清單：</p>
      ${itemsHtml}
      <hr style="margin: 15px 0;">
      <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #e74c3c;">
        <span>總計：</span>
        <span>$${cartStore.totalPrice}</span>
      </div>
      <p style="margin-top: 10px; color: #666; font-size: 12px;">
        * 點擊「確認結帳」將前往結帳頁面完成訂單
      </p>
    </div>
  `
}

const handleCheckout = async () => {
  if (!cart.value.length) {
    ElMessage.warning('購物車是空的，請先添加商品')
    return
  }

  try {
    await ElMessageBox.confirm(createCheckoutConfirmContent(), '確認結帳', {
      confirmButtonText: '確認結帳',
      cancelButtonText: '取消',
      type: 'info',
      customClass: 'checkout-confirm-dialog',
      dangerouslyUseHTMLString: true,
    })

    handleClose()

    setTimeout(() => {
      goTo('Checkout')
      ElMessage.success('正在前往結帳頁面...')
    }, 300)
  } catch {
    ElMessage.info('已取消結帳')
  }
}

const removeItem = (productId) => {
  cartStore.removeProduct(productId)
  ElMessage.success('商品已從購物車移除')
}
</script>

<style scoped>
.cart-content {
  flex-grow: 1;
  overflow-y: auto;
}

.cart-price {
  font-weight: 600;
}

.cart-footer {
  padding: 16px;
  border-top: 1px solid #ddd;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cart-total-label {
  font-size: 18px;
  font-weight: bold;
}

.cart-total-amount {
  font-size: 20px;
  font-weight: bold;
  color: #e74c3c;
}

.cart-checkout-btn {
  width: 100%;
}

.cart-checkout-icon {
  margin-right: 8px;
}
</style>
