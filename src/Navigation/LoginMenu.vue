<template>
  <div class="user-menu-container">
    <!--關於我們-->
    <el-button class="topbar-btn" @click="goAbout">關於我們</el-button>
    <!-- 回首頁按鈕 -->
    <el-button class="topbar-btn" @click="goHome">回首頁</el-button>
    <!-- 未登入時顯示登入按鈕 -->
    <el-button v-if="!isLogin" class="topbar-btn" @click="goLogin">登入</el-button>

    <!-- 已登入時 -->
    <template v-else>
      <!-- 使用者資訊 -->
      <div class="user-info">
        👤 {{ user.fullName || user.username }}
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
import { computed } from 'vue'
import { More, MoreFilled, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia'
import { useNavigation } from '@/composables/useNavigation'

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
const logout = () => {
  userStore.logout()
  goHome()
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
</style>
