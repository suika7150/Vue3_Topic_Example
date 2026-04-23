<template>
  <div class="top-bar">
    <div class="topbar-left">
      <router-link to="/" class="logo"
        ><img src="/Logo/Logo.png" alt="Logo" class="logo-img"
      /></router-link>
    </div>
    <!-- 登入選單 -->
    <div class="topbar-right">
      <LoginMenu :small="true" />
    </div>
  </div>
  <div class="menu-bar">
    <div class="topbar-main">
      <!-- 主下拉選單 -->
      <CenterDropdown />
    </div>
  </div>
</template>

<script setup>
import LoginMenu from './LoginMenu.vue'
import CenterDropdown from './CenterDropdown.vue'

const props = defineProps({
  bannerOn: {
    type: [String, Boolean, Number],
    default: false,
  },
})
</script>

<style scoped>
.top-bar {
  flex-direction: row;
  position: fixed;
  display: flex;
  top: 40px;
  left: 0;
  width: 100%;
  height: 110px;
  background-color: #000000fb;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  overflow: visible;
  z-index: 1002;
}
.menu-bar {
  flex-direction: row;
  position: fixed;
  display: flex;
  top: 100px;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: #000000fb;
  justify-content: center;
  align-items: center;
  overflow: visible;
  z-index: 1001;
}

.topbar-main {
  flex-direction: row;
  display: flex;
  align-items: center;
  padding-right: 0px;
  margin-left: 50px;
  flex-shrink: 1;
  min-width: auto;
  justify-content: center;
}

.topbar-left {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
  flex-shrink: 0;
}

.logo {
  font-size: 100px;
  color: #fff;
  text-decoration: none;
}

.logo-img {
  display: block;
  width: 100%;
  height: 170px;
  max-height: 100%;
  padding-top: 0px;
  transform: translateY(40px);
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  overflow: visible;
  flex-shrink: 0;
  min-width: 0;
  height: 100%;
  padding-bottom: 50px;
}

.dropdown-below {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
}

@media (max-width: 1024px) {
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    position: fixed;
    height: 110px;
    background-color: #000000fb;
    padding: 10px 0;
    z-index: 1002;
  }

  .topbar-main {
    display: none;
  }

  .menu-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    flex-direction: row;
    top: 0px;
    left: 0;
    height: 100px;
    width: 100%;
    height: 100px;
    background-color: #000000fb;

    overflow: visible;
    z-index: 1001;
  }

  .logo-img {
    display: block;
    width: auto;
    height: 90px;
    transform: translateX(0px);
  }
  .topbar-right {
    display: flex;
    align-items: center;
    padding-bottom: 0;
    flex-shrink: 1;
    min-width: 0;
  }
}
</style>
