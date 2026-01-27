<template>
  <!-- <div class="searchinput"> -->
  <SearchInput />
  <!-- </div> -->
  <div :class="['user-menu-container']">
    <el-button type="link" class="hamburger-btn" @click="sidebarStore.toggleCollapse">
      <el-icon><Fold /></el-icon>
    </el-button>

    <el-drawer
      :model-value="!sidebarStore.isCollapsed"
      :before-close="sidebarStore.toggleCollapse"
      title="導航選單"
      direction="ltr"
      width="250px"
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

    <!-- 未登入時顯示登入按鈕 -->
    <el-button v-if="!isLogin" class="topbar-member-btn" @click="goLoginFromTopbar"
      ><el-icon class="userfilled-icon"><UserFilled /></el-icon>
      <span class="member-text"></span>
    </el-button>

    <!-- 已登入時 -->
    <template v-else>
      <!-- 通知鈴鐺 -->
      <el-dropdown trigger="click" @visible-change="onDropdownToggle">
        <el-badge :is-dot="hasUnread" class="notification-badge">
          <el-button type="link" class="notification-btn">
            <font-awesome-icon :icon="[bellIconPrefix, 'bell']" />
          </el-button>
        </el-badge>
        <!-- 通知下拉選單 -->
        <template #dropdown>
          <el-dropdown-menu class="notification-menu">
            <el-dropdown-item disabled><strong>通知中心</strong></el-dropdown-item>

            <el-dropdown-item
              v-for="(notice, index) in notifications"
              :key="index"
              @click="markAsRead(index)"
              class="notice-item"
            >
              <span
                class="unread-dot"
                :style="{ visibility: notice.read ? 'hidden' : 'visible' }"
              ></span>
              <span>{{ notice.message }}</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="notifications.length === 0" disabled
              >暫無新通知</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 使用者資訊 -->
      <div class="user-info">
        <div><font-awesome-icon :icon="['fas', 'user']" /> 歡迎 {{ user.username }}</div>
        <span v-if="remaining > 0" class="token-timer">
          Token 將於 <strong>{{ $formatSecondsToHHMMSS(remaining) }}</strong> 後過期
        </span>
      </div>

      <el-button class="topbar-logout-btn" @click="logout">
        <span class="member-text">登出</span>
      </el-button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onDeactivated } from 'vue'
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/store/sidebarStore'
import { useNavigation } from '@/composables/useNavigation'
import SearchInput from './SearchInput.vue'
import { Setting, User, Fold, UserFilled } from '@element-plus/icons-vue'
import CartDrawer from '@/components/CartDrawer.vue'
import SidebarMenu from './SidebarMenu.vue'
import { useRouter } from 'vue-router'

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

<style #scoped>
.topbar-member-btn.el-button {
  background-color: transparent; /* Element Plus 主色 */
  color: white;
  border-radius: 6px;
  padding: 8px 8px;
  margin: 0px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: background-color 0.3s ease;
  cursor: pointer;
  box-shadow: none;
}
.topbar-member-btn.el-button:hover {
  color: #70e0eb;
}
.topbar-logout-btn {
  background-color: transparent; /* 跟 Topbar 融合 */
  border: none; /* 去掉邊框 */
  color: white; /* 文字白色 */
  box-shadow: none; /* 去掉陰影 */
  padding: 8px 12px; /* 可依 Topbar 調整 */
}
.topbar-logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #70e0eb;
}
.userfilled-icon {
  font-size: 18px;
  /* bottom: 2px; */
}

.user-menu-container {
  display: flex;
  align-items: center;
  /* gap: 5px; */
  margin-left: auto;
  /* padding: px; */
}

.user-menu-container.small .topbar-member-btn.el-button {
  padding: 4px 6px;
  font-size: 12px;
}

.user-menu-container.small .user-info {
  padding: 4px 6px;
  font-size: 12px;
}

.user-menu-container.small .token-timer {
  font-size: 10px;
}

.user-menu-container.small .hamburger-btn {
  padding: 4px 6px;
  font-size: 19px;
}

.user-menu-container.small .notification-btn {
  padding: 4px 6px;
  font-size: 14px;
}

.menu-in-drawer {
  border-right: none;
}

/* 使用者資訊樣式 */
.user-info {
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #e6eaf2;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.token-timer {
  color: #e67e22;
  font-weight: bold;
  font-size: 13px;
}

.hamburger-btn {
  background-color: transparent; /* Element Plus 主色 */
  color: white;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: background-color 0.3s ease;
  cursor: pointer;
  box-shadow: none;
}
.hamburger-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}
.notification-btn {
  background-color: transparent; /* Element Plus 主色 */
  color: white;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: background-color 0.3s ease;
  cursor: pointer;
  box-shadow: none;
}
.notification-btn:hover,
.notification-btn:focus {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}
.notification-menu {
  min-width: 200px;
  padding: 4px;
}
.notification-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* margin-right: 10px; */
}
.notification-badge .el-badge__content {
  width: 8px; /* 調整大小 */
  height: 8px;
  background-color: red; /* 顏色 */
  top: 10px; /* 調整位置 */
  left: 18px;
  transition: none !important; /* 取消過渡 */
}

.unread-dot {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: 2px;
  height: 2px;
  background-color: red;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.notice-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.message {
  flex: 1;
  color: white;
}
</style>
