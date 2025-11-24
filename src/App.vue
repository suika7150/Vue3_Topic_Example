<script setup>
import BottomFooter from './Navigation/BottomFooter.vue'
import CategorySidebar from './Navigation/CategorySidebar.vue'
import TopBar from './Navigation/TopBar.vue'
import { computed } from 'vue'
import { getNavMenu } from './Navigation/getNavMenu'
import { useUserStore } from '@/store/userStore'
import TopBarAdBanner from './Navigation/TopBarAdBanner.vue'
import BackToTop from './Navigation/BackToTop.vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const userRole = computed(() => userStore.userRole)
const navMenu = computed(() => {
  return getNavMenu(userRole.value)
})
</script>

<template>
  <!-- 將 BackToTop 移到最外層，不受 overflow 影響 -->
  <div class="back-to-top"><BackToTop /></div>

  <div class="app-wrapper">
    <header>
      <div class="topbar-ad-banner">
        <TopBarAdBanner />
      </div>

      <div class="topbar">
        <TopBar bannerOn />
      </div>
    </header>

    <div class="layout">
      <div class="el-menu-vertical-demo">
        <CategorySidebar :categories="navMenu" />
      </div>

      <!-- <Breadcrumb /> -->

      <div class="content">
        <router-view />
      </div>
    </div>
    <footer class="footer">
      <BottomFooter />
    </footer>
  </div>
</template>

<style scoped>
.back-to-top {
  z-index: 9999;
}
.topbar-ad-banner {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 160px;
  background-color: rgb(19, 204, 170);
  z-index: 1001;
}

.topbar {
  position: fixed;
  top: 30px; /* 根據 Banner 高度調整，避免被蓋住 */
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1002;
  /* margin-top: 60px; */
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 40px;
  width: 100%; /* 填滿整個瀏覽器寬度 */
  margin: 0; /*自動置中 */
  padding: 0;
  overflow-x: hidden; /* 防止水平滾動條 */
  box-sizing: border-box;
}

.layout {
  display: flex;
  flex: 1; /* 讓 layout 撐滿剩餘高度 */
  width: 100%;
  margin-top: 80px;
  align-items: stretch; /*Sidebar與Content高度一致貼齊 */
  justify-content: stretch; /* Sidebar與Content寬度撐滿 */
  box-sizing: border-box;
}

/* 側邊欄 */
.el-menu-vertical-demo {
  position: sticky;
  top: 100px;
  /* width: 240px; */
  height: auto;
  background-color: white;
  box-shadow: 2px 0 5px rgba(245, 240, 240, 0.05);
  transition: all 0.3s;
  display: flex;
  /* flex-direction: column; */
  padding: 100px 0 0;
}

/* 主內容區 */
.content {
  width: 100%;
  display: flex;
  flex: 1;
  /* margin: 30px; */
  padding: 150px;
  background-color: white;
  overflow: hidden;
  box-sizing: border-box; /* 避免 padding 推寬度 */
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
