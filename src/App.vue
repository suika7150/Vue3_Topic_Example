<script setup>
import BottomFooter from './Navigation/BottomFooter.vue'
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
      <div class="topbar-ad-banner">
        <TopBarAdBanner />
      </div>

      <div>
        <TopBar bannerOn />
      </div>
    </header>
    <div class="layout">
      <Breadcrumb />

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
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.layout {
  display: flex;
  flex: 1;
  width: 100%;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
}

/* 側邊欄 */
.el-menu-vertical-demo {
  display: flex;
  position: sticky;
  top: 0px;
  height: 70px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(245, 240, 240, 0.05);
  transition: all 0.3s;
  padding: 90px 0 0;
}

/* 主內容區 */
.content {
  display: flex;
  flex: 1;
  padding-top: 220px;
  overflow: hidden;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
}

/* Footer */
.footer {
  overflow-x: hidden;
}

@media (max-width: 912px) {
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
    width: 100%;
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
