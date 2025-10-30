<script setup>
import BottomFooter from './navigation/BottomFooter.vue'
import Breadcrumb from './navigation/Breadcrumb.vue'
import CategorySidebar from './navigation/CategorySidebar.vue'
import TopBar from './navigation/TopBar.vue'
import { computed } from 'vue'
import { getNavMenu } from './Navigation/getNavMenu'
import { useUserStore } from '@/store/userStore'
import TopBarAdBanner from './navigation/TopBarAdBanner.vue'
import BackToTop from './navigation/BackToTop.vue'

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
    <div class="layout">
      <div class="el-menu-vertical-demo">
        <CategorySidebar :categories="navMenu" />
      </div>
      <div class="content">
        <!-- <Breadcrumb /> -->
        <router-view />
        <span><BackToTop /></span>
      </div>
    </div>
  </div>
  <BottomFooter />
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%; /* 填滿整個瀏覽器寬度 */
  margin: 0; /*自動置中 */
  padding: 0;
  overflow-x: hidden;
  box-sizing: border-box;
}

.topbar-ad-banner {
  position: fixed;
  display: flex;
  top: 50px;
  left: 0;
  width: 100%;
  background-color: #000;
  padding: 20px 0;
}

.layout {
  display: flex;
  width: 100%;
  /* min-height: calc(100vh - 80px - 50px); 減掉 TopBar 與 Footer 高度 */
  box-sizing: border-box;
  margin-top: 100px;
}

/* 側邊欄 */
.el-menu-vertical-demo {
  width: 240px;
  min-height: 100vh;
  background-color: #f5f7fa;
  box-shadow: 2px 0 5px rgba(245, 240, 240, 0.05);
  transition: all 0.3s;
  /* box-sizing: border-box; */
  /* border-right: 1px solid #e0e0e0; */
}

/* 主內容區 */
.content {
  flex: 1;
  padding: 80px;
  background-color: #f5f7fa;
  overflow: auto;
  box-sizing: border-box; /* 避免 padding 推寬度 */
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
