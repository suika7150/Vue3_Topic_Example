<template>
  <div class="user-menu">
    <SearchInput />

    <el-button link class="user-menu-btn" @click="sidebarStore.toggleCollapse">
      <el-icon><Fold /></el-icon>
    </el-button>
    <el-badge :value="totalQuantity" :hidden="totalQuantity === 0" class="cart-badge">
      <el-button link class="user-menu-btn" @click="openCartDrawer">
        <el-icon><ShoppingCart /></el-icon>
      </el-button>
    </el-badge>

    <el-drawer
      :model-value="!sidebarStore.isCollapsed"
      :before-close="sidebarStore.toggleCollapse"
      :lock-scroll="false"
      direction="ltr"
      size="300px"
      append-to-body
    >
      <SidebarMenu
        :is-login="isLogin"
        @navigate="handleNavigate"
        @navigate-route="handleNavigate"
        @open-cart="openCartDrawer"
      />
    </el-drawer>

    <CartDrawer v-model:drawerVisible="showCartDrawer" />

    <!-- 未登入 -->
    <el-button v-if="!isLogin" class="user-menu-btn login" @click="goLoginFromTopbar">
      <el-icon><UserFilled /></el-icon>
    </el-button>

    <!-- 已登入 -->
    <template v-else>
      <!-- 通知 -->
      <el-dropdown trigger="click" @visible-change="onDropdownToggle">
        <el-badge :is-dot="hasUnread" class="badge">
          <el-button link class="user-menu-btn">
            <font-awesome-icon :icon="[bellIconPrefix, 'bell']" />
          </el-button>
        </el-badge>

        <template #dropdown>
          <el-dropdown-menu class="dropdown">
            <el-dropdown-item disabled>
              <strong>通知中心</strong>
            </el-dropdown-item>

            <el-dropdown-item
              v-for="(notice, index) in notifications"
              :key="index"
              class="item"
              @click="markAsRead(index)"
            >
              <span class="dot" :style="{ visibility: notice.read ? 'hidden' : 'visible' }"></span>

              <span>{{ notice.message }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button link class="user-menu-btn" @click="goOrderList">
        <span class="btn-text">我的訂單</span>
      </el-button>

      <!-- 使用者資訊 -->
      <div class="info">
        <div>
          <font-awesome-icon :icon="['fas', 'user']" />
          歡迎 {{ user.fullName }}
        </div>
      </div>

      <el-button class="user-menu-btn logout" @click="logout"> 登出 </el-button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/userStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { useCartStore } from '@/store/cartStore'
import { useNavigation } from '@/composables/useNavigation'
import CartDrawer from '@/components/CartDrawer.vue'
import SearchInput from './SearchInput.vue'
import SidebarMenu from './SidebarMenu.vue'
import { Fold, UserFilled, ShoppingCart } from '@element-plus/icons-vue'

const router = useRouter()
const sidebarStore = useSidebarStore()
const showCartDrawer = ref(false)
const userStore = useUserStore()
const cartStore = useCartStore()
const { user } = storeToRefs(userStore)
const { totalQuantity } = storeToRefs(cartStore)
const isLogin = computed(() => !!user.value?.isLogin)
const { goTo, goOrderList } = useNavigation()

const handleNavigate = (target) => {
  if (typeof target === 'string' && target.startsWith('/')) {
    router.push(target)
  } else if (typeof target === 'string') {
    goTo(target)
  }
  sidebarStore.toggleCollapse()
}

const goLoginFromTopbar = () => {
  goTo('login')
}

const logout = () => {
  userStore.logout()
  goTo('home')
}

//模擬通知資料
const notifications = ref([
  { message: '您的訂單已出貨', read: false },
  { message: '新活動上線，快來看看！', read: false },
  { message: '系統維護通知', read: true },
])

const props = defineProps({
  small: { type: Boolean, default: false },
})

// 標記通知為已讀
const hasUnread = computed(() => notifications.value.some((notice) => !notice.read))

const bellIconPrefix = computed(() => (hasUnread.value ? 'fas' : 'far'))

// 標記通知為已讀
const markAsRead = (index) => {
  notifications.value[index].read = true
}

const onDropdownToggle = (visible) => {
  if (visible) {
    // 可以在這裡加入打開下拉選單時的邏輯
    notifications.value.forEach((notice) => {
      notice.read = true
    })
  }
}

// 打開購物車抽屜
const openCartDrawer = () => {
  showCartDrawer.value = true
}
</script>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 2px;
}

/* 共用按鈕 */
.user-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: white;
  border: none;
  box-shadow: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 18px;
  transition: background-color 0.3s;
}

/* 購物車按鈕圓圈 */
.cart-badge :deep(.el-badge__content) {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff4757;
  font-family: Arial, sans-serif;
  border: none;
  top: 8px;
  right: 15px;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
  border-radius: 50%;
}

/* 訂單按鈕 */
.btn-text {
  font-size: 13px;
  font-weight: 500;
}

.user-menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #70e0eb;
}

/* 登入 */
.login {
  font-size: 20px;
}

/* 登出 */
.logout {
  font-size: 14px;
}

/* 使用者資訊 */
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 2px;
  padding: 0 2px;
  border-left: 1px solid rgba(255, 255, 255, 0.2); /* 加一條淡淡的分隔線 */
  line-height: 1.1;
}

/* 使用者資訊 */
.info div {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #e6eaf2;
  white-space: nowrap;
}

/* 使用者資訊 */
.info .fa-user {
  margin-right: 5px;
  filter: drop-shadow(0 0 2px rgba(112, 224, 235, 0.5));
}

/* 下拉選單 */
.dropdown {
  min-width: 200px;
  padding: 4px;
}

/* 通知項目 */
.item {
  position: relative;
  display: flex;
  align-items: center;
}

.dot {
  position: absolute;
  right: 10px;
  width: 4px;
  height: 4px;
  background: red;
  border-radius: 50%;
}

/* 通知紅點 */
.badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.badge .el-badge__content {
  width: 8px;
  height: 8px;
  background-color: red;
}

.badge :deep(.el-badge__content) {
  transition: none; /* 不要拿掉，強制取消動畫 */
  top: 10px;
  left: 15px;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  color: #303133;
}
</style>
