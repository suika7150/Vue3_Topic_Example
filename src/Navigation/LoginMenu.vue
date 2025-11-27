<template>
  <SearchInput />
  <div :class="['user-menu-container']">
    <!-- 側邊欄 -->

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
      <el-menu default-active="1" class="menu-in-drawer">
        <el-menu-item index="1" @click="goNews">最新消息</el-menu-item>
        <el-menu-item index="2" @click="goAbout">關於我們</el-menu-item>
        <el-menu-item index="3" @click="goHome">回首頁</el-menu-item>
        <!-- <el-divider /> -->
        <el-menu-item index="4" @click="openCartDrawer">購物車</el-menu-item>
        <el-menu-item index="5" @click="goProfile">個人資料維護</el-menu-item>
        <el-menu-item index="6" @click="goSetting">設定</el-menu-item>
        <el-menu-item index="7" divided @click="goLogin">登入</el-menu-item>
        <el-menu-item index="8" divided @click="goRegister">註冊</el-menu-item>
      </el-menu>
      <!-- <CategorySidebar /> -->
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

      <el-button type="link" class="topbar-logout-btn" @click="logout">
        <span class="member-text">登出</span>
      </el-button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onDeactivated } from 'vue'
// import { Setting, Bell, BellFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/store/sidebarStore'
import { useNavigation } from '@/composables/useNavigation'
import SearchInput from './SearchInput.vue'
import { Setting, User, Fold, UserFilled } from '@element-plus/icons-vue'
import CartDrawer from '@/components/CartDrawer.vue'
// import CategorySidebar from './Navigation/CategorySidebar.vue'

const sidebarStore = useSidebarStore()
const showCartDrawer = ref(false)
const userStore = useUserStore()
const isLogin = computed(() => !!userStore.user?.isLogin)
const user = computed(() => userStore.user || {})
const { remainingTime: remaining } = storeToRefs(userStore)

const { goTo } = useNavigation()

const goHome = () => {
  goTo('Home')
  sidebarStore.toggleCollapse()
}

const goSetting = () => {
  goTo('Setting')
  sidebarStore.toggleCollapse()
}
const goLogin = () => {
  goTo('Login')
  sidebarStore.toggleCollapse()
}

const goRegister = () => {
  goTo('Register')
  sidebarStore.toggleCollapse()
}
const goLoginFromTopbar = () => {
  goTo('Login')
}
const goProfile = () => {
  goTo('Profile')
  sidebarStore.toggleCollapse()
}
const goAbout = () => {
  goTo('About')
  sidebarStore.toggleCollapse()
}
const goNews = () => {
  goTo('News')
  sidebarStore.toggleCollapse()
}
const logout = () => {
  userStore.logout()
  goTo('Home')
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
  sidebarStore.toggleCollapse()
}
</script>

<style #scoped>
.topbar-member-btn.el-button {
  background-color: transparent; /* 跟 Topbar 融合 */
  border: none; /* 去掉邊框 */
  color: white; /* 文字白色 */
  box-shadow: none; /* 去掉陰影 */
  padding: 8px 5px; /* 可依 Topbar 調整 */
}

.topbar-member-btn.el-button:hover,
.topbar-member-btn.el-button:focus {
  background-color: rgba(255, 255, 255, 0.1); /*輕微 hover 提示 */
  color: white; /* 文字維持白色 */
  outline: none;
  box-shadow: none;
}
.topbar-logout-btn {
  background-color: transparent; /* 跟 Topbar 融合 */
  border: none; /* 去掉邊框 */
  color: white; /* 文字白色 */
  box-shadow: none; /* 去掉陰影 */
  padding: 8px 12px; /* 可依 Topbar 調整 */
}
.topbar-logout-btn.el-button:hover,
.topbar-logout-btn.el-button:focus {
  background-color: rgba(255, 255, 255, 0.1); /*輕微 hover 提示 */
  color: white; /* 文字維持白色 */
  outline: none;
  box-shadow: none;
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
.notification-btn:hover {
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
