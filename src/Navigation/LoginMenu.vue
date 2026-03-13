<template>
  <div class="user-menu">
    <SearchInput />

    <el-button type="link" class="user-menu-btn" @click="sidebarStore.toggleCollapse">
      <el-icon><Fold /></el-icon>
    </el-button>

    <el-drawer
      :model-value="!sidebarStore.isCollapsed"
      :before-close="sidebarStore.toggleCollapse"
      title="導航選單"
      direction="ltr"
      size="300px"
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
          <el-button type="link" class="user-menu-btn">
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

      <!-- 使用者資訊 -->
      <div class="info">
        <div>
          <font-awesome-icon :icon="['fas', 'user']" />
          歡迎 {{ user.username }}
        </div>

        <span v-if="remaining > 0" class="timer">
          Token 將於
          <strong>{{ $formatSecondsToHHMMSS(remaining) }}</strong>
          後過期
        </span>
      </div>

      <el-button class="user-menu-btn logout" @click="logout"> 登出 </el-button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/userStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { useNavigation } from '@/composables/useNavigation'
import CartDrawer from '@/components/CartDrawer.vue'
import SearchInput from './SearchInput.vue'
import SidebarMenu from './SidebarMenu.vue'
import { Fold, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const sidebarStore = useSidebarStore()
const showCartDrawer = ref(false)
const userStore = useUserStore()
const isLogin = computed(() => !!userStore.user?.isLogin)
const user = computed(() => userStore.user || {})
const { remainingTime: remaining } = storeToRefs(userStore)

const { goTo } = useNavigation()

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
}

/* 共用按鈕 */
.user-menu-btn {
  background: transparent;
  color: white;
  border: none;
  box-shadow: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
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
  font-size: 10px;
  color: #e6eaf2;
  overflow: hidden;
}

.info div,
.info .timer {
  white-space: nowrap;
}
/* token */
.timer {
  color: #e67e22;
  font-weight: bold;
  font-size: 10px;
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
</style>
