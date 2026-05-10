<template>
  <div class="topbar-wrapper">
    <!-- 原始 TopBar -->
    <header class="header-original">
      <div class="top">
        <router-link to="/" class="logo">
          <img src="/logo/logo.png" />
        </router-link>
        <LoginMenu />
      </div>
      <div class="menu">
        <CenterDropdown />
      </div>
    </header>

    <!-- 迷你 TopBar -->
    <header v-if="isScrolled" class="header-sticky">
      <div class="top-mini">
        <router-link to="/" class="logo-mini">
          <img src="/logo/logo.png" />
        </router-link>
        <LoginMenu />
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LoginMenu from './LoginMenu.vue'
import CenterDropdown from '../ui/CenterDropdown.vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 190
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 原始 TopBar  */
.header-original {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  background: #000;
}

.top {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  height: 130px;
  transform: translateY(40px);
  display: block;
}

/* 迷你版 TopBar */
.header-sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
  background: #000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  animation: slideDown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.top-mini {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-mini img {
  height: 40px;
  display: block;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
