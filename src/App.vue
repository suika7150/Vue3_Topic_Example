<script setup>
import BottomFooter from './Navigation/BottomFooter.vue'
import TopBar from './Navigation/TopBar.vue'
import { computed } from 'vue'
import { getNavMenu } from './Navigation/getNavMenu'
import { useUserStore } from '@/store/userStore'
import TopBarAdBanner from './Navigation/TopBarAdBanner.vue'
import BackToTop from './Navigation/BackToTop.vue'
import SideAdBanner from './components/SideAdBanner.vue'
import { useSidebarStore } from './store/sidebarStore'
// import Breadcrumb from './Navigation/Breadcrumb.vue'

const sidebarStore = useSidebarStore()
const userStore = useUserStore()
const userRole = computed(() => userStore.userRole)
const navMenu = computed(() => {
  return getNavMenu(userRole.value)
})

const adShift = computed(() => {
  console.log('🚀 側邊欄狀態變了！目前是:', userStore.isDrawerOpen)
  return !sidebarStore.isCollapsed ? 300 : 0
})
</script>

<template>
  <div class="app-wrapper">
    <header>
      <div class="topbar-ad-banner">
        <TopBarAdBanner />
      </div>

      <div>
        <TopBar bannerOn />
      </div>
    </header>

    <div class="layout">
      <SideAdBanner
        position="left"
        :shift="adShift"
        image="/Banner/SideAdBanner.png"
        link="/promo/double-11"
        title="年終狂歡節"
      />

      <div class="content">
        <router-view />
      </div>
    </div>
    <BackToTop class="backtotop" />
    <footer class="footer">
      <BottomFooter />
    </footer>
  </div>
</template>

<style scoped>
.topbar-ad-banner {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 30px;
  background-color: rgb(19, 204, 170);
  z-index: 1001;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
}

.layout {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

/* 側邊欄 */
/* .el-menu-vertical-demo {
  display: flex;
  position: sticky;
  top: 0px;
  height: 70px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(245, 240, 240, 0.05);
  transition: all 0.3s;
  padding: 90px 0 0;
} */

/* 主內容區 */
.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  padding-top: 220px;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.backtotop {
  z-index: 200;
}
.footer {
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .layout {
    display: flex;
    flex: 1;
    width: 100%;
    align-items: stretch;
    justify-content: stretch;
    box-sizing: border-box;
  }

  /* 主內容區 */
  .content {
    padding-top: 139px;
    background-color: white;
  }

  .topbar-ad-banner {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100vw;
    height: 50px;
    background-color: rgb(19, 204, 170);
    z-index: 1001;
  }
}
</style>
