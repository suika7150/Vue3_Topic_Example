<script setup>
import BottomFooter from './navigation/BottomFooter.vue'
import Breadcrumb from './navigation/Breadcrumb.vue'
import CategorySidebar from './navigation/CategorySidebar.vue'
import TopBar from './navigation/TopBar.vue'
import { computed } from 'vue'
import { getNavMenu } from './Navigation/getNavMenu'
import { useUserStore } from '@/store/userStore'

const userStore = useUserStore()
const userRole = computed(() => userStore.userRole)
const navMenu = computed(() => {
  return getNavMenu(userRole.value)
})
</script>

<template>
  <header>
    <TopBar bannerOn />
  </header>

  <main>
    <div class="layout">
      <CategorySidebar :categories="navMenu" />

      <div class="content">
        <router-view />
      </div>
    </div>
  </main>
  <BottomFooter />
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
  /* 整體背景 */
}

/* 側邊欄 */
.el-menu-vertical-demo {
  width: 240px;
  min-height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

/* 主內容區 */
.content {
  margin-left: 240px;
  padding-top: 100px;
  flex: 1;
  padding: 32px;
  background-color: #f5f7fa;
  overflow: auto;
}

/* 響應式：小於 768px 隱藏側邊欄 */
@media (max-width: 768px) {
  .el-menu-vertical-demo {
    display: none;
  }

  .content {
    padding: 16px;
  }
}
</style>
