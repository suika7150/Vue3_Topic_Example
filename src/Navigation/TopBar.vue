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
import { useRouter } from 'vue-router'
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
  top: 150px;
  left: 0;
  width: 100%;
  height: 80px;
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
  min-width: 0;
  justify-content: center;
}

.topbar-left {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 30px; /* Logo 與下拉選單間距 */
  flex-shrink: 0;
}

.logo {
  font-size: 100px;
  color: #fff;
  text-decoration: none; /* 移除底線 */
}

.logo-img {
  display: block;
  width: auto;
  max-height: 100%;
  height: 130px;
  padding: 0px 0px;
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  overflow: visible;
  flex-shrink: 1;
  min-width: 0;
  height: 100%;
  padding-bottom: 50px;
}

.dropdown-below {
  position: absolute;
  top: 100%; /* 正下方 */
  right: 0; /* 右對齊 LoginMenu */
  margin-top: 4px; /* 距離 LoginMenu 一點縫隙 */
  /* z-index: 1001; 確保在 TopBar 之上 */
}

@media (max-width: 912px) {
  .top-bar {
    flex-direction: row;
    position: fixed;
    display: flex;
    top: 40px;
    left: 0;
    width: 100%;
    height: 80px;
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
    top: 150px;
    left: 0;
    width: 100%;
    height: 0px;
    background-color: #000000fb;
    justify-content: center;
    align-items: center;
    overflow: visible;
    z-index: 1001;
  }

  .logo-img {
    display: flex;
    height: 90px;
    padding-bottom: 10px;
  }
}
</style>
