<script setup>
import { computed } from 'vue'
import SideAdBanner from './components/ad/SideAdBanner.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import { useCartStore } from '@/store/cartStore'
import BottomFooter from './components/navigation/BottomFooter.vue'
import TopBar from './components/navigation/TopBar.vue'
import TopBarAdBanner from './components/navigation/TopBarAdBanner.vue'
import BackToTop from './components/navigation/BackToTop.vue'
import { useUserStore } from '@/store/userStore'
import { useSidebarStore } from './store/sidebarStore'
import ModalProvider from './components/ModalProvider.vue'
import SidebarMenu from '@/components/navigation/SidebarMenu.vue'

const sidebarStore = useSidebarStore()
const userStore = useUserStore()
const cartStore = useCartStore()

const userRole = computed(() => userStore.userRole)

const isLogin = computed(() => !!userStore.user?.isLogin)

const adShift = computed(() => {
  return !sidebarStore.isCollapsed ? 300 : 0
})

const handleSidebarNavigate = () => {
  sidebarStore.setCollapse(true)
}
</script>

<template>
  <div class="app-wrapper">
    <ModalProvider />

    <el-drawer
      class="nav-sidebar-drawer"
      :model-value="!sidebarStore.isCollapsed"
      @close="sidebarStore.setCollapse(true)"
      :lock-scroll="false"
      direction="ltr"
      size="300px"
      append-to-body
    >
      <template #header>
        <span class="sidebar-header-title">導航選單</span>
      </template>
      <SidebarMenu :is-login="isLogin" @navigate="handleSidebarNavigate" />
    </el-drawer>

    <CartDrawer v-model:drawerVisible="cartStore.drawerVisible" />

    <div class="topbar-ad-banner">
      <TopBarAdBanner />
    </div>

    <TopBar bannerOn />

    <div class="sidebar-layout">
      <SideAdBanner
        position="left"
        :shift="adShift"
        image="/banner/side-ad-banner.png"
        link="/products"
        title="年終狂歡節"
      />

      <div class="content" :class="$route.name">
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
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  z-index: 1100;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
}

.sidebar-layout {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  flex: 1;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
}

/* 主內容區 */
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 220px;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  background: transparent;
}

/* 導航選單 */
.sidebar-header-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 1px;
}

/* 最新消息頁面 */
.content.news {
  background: #0a0a0a;
  min-height: 100vh;
}

/* 關於我們頁面 */
.content.canvas {
  padding-top: 0;
}

.backtotop {
  z-index: 200;
}

.footer {
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .sidebar-layout {
    display: flex;
    flex: 1;
    width: 100%;
    align-items: stretch;
    justify-content: stretch;
    box-sizing: border-box;
  }

  /* 主內容區 */
  .content {
    padding-top: 110px;
  }

  .topbar-ad-banner {
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    background-color: rgb(19, 204, 170);
    z-index: 1003;
  }
}
</style>
