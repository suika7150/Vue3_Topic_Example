<template>
  <SearchInput />
  <div class="user-menu-container">
    <el-button class="topbar-btn" @click="goNews">最新消息 </el-button>
    <!--關於我們-->
    <el-button class="topbar-btn" @click="goAbout">關於我們</el-button>
    <!-- 回首頁按鈕 -->
    <el-button class="topbar-btn" @click="goHome">回首頁</el-button>
    <!-- 未登入時顯示登入按鈕 -->
    <el-button v-if="!isLogin" class="topbar-btn" @click="goLogin">會員</el-button>

    <!-- 已登入時 -->
    <template v-else>
      <!-- 通知鈴鐺 -->
      <el-dropdown trigger="click" @visible-change="onDropdownToggle">
        <el-badge :is-dot="hasUnread" class="notification-badge" style="margin-right: 10px">
          <el-button type="link" class="notification-btn">
            <el-icon>
              <component :is="hasUnread ? BellFilled : Bell" />
            </el-icon>
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
        <div>
          <el-icon><User /></el-icon> 歡迎 {{ user.username }}
        </div>
        <span v-if="remaining > 0" class="token-timer">
          Token 將於 <strong>{{ $formatSecondsToHHMMSS(remaining) }}</strong> 後過期
        </span>
      </div>
      <!-- 漢堡下拉選單 -->
      <el-dropdown>
        <el-button type="link" class="hamburger-btn">
          <el-icon><Setting /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goCheckout">購物車</el-dropdown-item>
            <el-dropdown-item @click="goProfile">個人資料維護</el-dropdown-item>
            <el-dropdown-item @click="goSetting">設定</el-dropdown-item>
            <el-dropdown-item divided @click="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onDeactivated } from 'vue'
import { Setting, Bell, BellFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia'
import { useNavigation } from '@/composables/useNavigation'
import SearchInput from './SearchInput.vue'
import { User } from '@element-plus/icons-vue'

const userStore = useUserStore()
const isLogin = computed(() => !!userStore.user?.isLogin)
const user = computed(() => userStore.user || {})
const { remainingTime: remaining } = storeToRefs(userStore)

const { goTo, goHome } = useNavigation()

const goCheckout = () => goTo('Checkout')
const goSetting = () => goTo('Setting')
const goLogin = () => goTo('Login')
const goProfile = () => goTo('Profile')
const goAbout = () => goTo('About')
const goNews = () => goTo('News')
const logout = () => {
  userStore.logout()
  goHome()
}

//模擬通知資料
const notifications = ref([
  { message: '您的訂單已出貨', read: false },
  { message: '新活動上線，快來看看！', read: false },
  { message: '系統維護通知', read: true },
])

// 標記通知為已讀
const hasUnread = computed(() => notifications.value.some((notice) => !notice.read))

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
</script>

<style scoped>
.topbar-btn.el-button {
  background-color: transparent; /* 跟 Topbar 融合 */
  border: none; /* 去掉邊框 */
  color: white; /* 文字白色 */
  box-shadow: none; /* 去掉陰影 */
  padding: 8px 12px; /* 可依 Topbar 調整 */
}

.topbar-btn.el-button:hover,
.topbar-btn.el-button:focus {
  background-color: rgba(255, 255, 255, 0.1); /*輕微 hover 提示 */
  color: white; /* 文字維持白色 */
  outline: none;
  box-shadow: none;
}

.user-menu-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 使用者資訊樣式（更明顯） */
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
