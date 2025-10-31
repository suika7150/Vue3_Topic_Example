<script setup>
import BottomFooter from './Navigation/BottomFooter.vue'
import Breadcrumb from './Navigation/Breadcrumb.vue'
import CategorySidebar from './Navigation/CategorySidebar.vue'
import TopBar from './Navigation/TopBar.vue'
import { computed } from 'vue'
import { getNavMenu } from './Navigation/getNavMenu'
import { useUserStore } from '@/store/userStore'
import TopBarAdBanner from './Navigation/TopBarAdBanner.vue'
import BackToTop from './Navigation/BackToTop.vue'

const userStore = useUserStore()
const userRole = computed(() => userStore.userRole)
const navMenu = computed(() => {
  return getNavMenu(userRole.value)
})
</script>

<template>
  <div class="app-wrapper">
    <header>
      <TopBar bannerOn />
    </header>
    <div class="topbar-ad-banner">
      <TopBarAdBanner />
    </div>
    <div class="layout">
      <div class="el-menu-vertical-demo">
        <CategorySidebar :categories="navMenu" />
      </div>
      <!-- <Breadcrumb /> -->
      <div class="content">
        <router-view />
        <span><BackToTop /></span>
      </div>
    </div>
    <footer class="footer">
      <BottomFooter />
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%; /* 填滿整個瀏覽器寬度 */
  margin: 0; /*自動置中 */
  padding: 0;
  overflow-x: hidden; /* 防止水平滾動條 */
  box-sizing: border-box;
}

.topbar-ad-banner {
  position: fixed;
  display: flex;
  top: 100px;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* 黑色透明 */
  padding: 20px 0;
  z-index: 1;
}

.layout {
  display: flex;
  flex: 1; /* 讓 layout 撐滿剩餘高度 */
  width: 100%;
  margin-top: 100px;
  align-items: stretch; /*Sidebar與Content高度一致貼齊 */
  justify-content: stretch; /* Sidebar與Content寬度撐滿 */
  box-sizing: border-box;
}

/* 側邊欄 */
.el-menu-vertical-demo {
  width: 240px;
  height: auto;
  background-color: #f5f7fa;
  box-shadow: 2px 0 5px rgba(245, 240, 240, 0.05);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  margin-top: 35px;
}

/* 主內容區 */
.content {
  flex: 1;
  padding: 50px;
  background-color: white;
  overflow: auto;
  box-sizing: border-box; /* 避免 padding 推寬度 */
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

/* Footer 固定在底部 */
.footer {
  overflow-x: hidden; /* 防止水平滾動條 */
}

/* 響應式：小於 768px 隱藏側邊欄 */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  .content {
    padding: 16px;
  }
}
</style>
