<template>
  <div class="top-bar">
    <div class="topbar-left">
      <router-link to="/" class="logo"
        ><img src="/Logo/Logo.png" alt="Logo" class="logo-img"
      /></router-link>
    </div>

    <div class="topbar-right-stack">
      <!-- 登入選單 -->
      <div class="topbar-right">
        <LoginMenu :small="true" />
      </div>

      <div class="topbar-main">
        <!-- 主下拉選單 -->
        <CenterDropdown />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginMenu from './LoginMenu.vue'
import CenterDropdown from './CenterDropdown.vue'
import { useRouter } from 'vue-router'

// defineProps({ bannerOn: { type: Boolean, default: false } })
// const onDropdownSelect = (item) => {
//   if (item === '選項 1') goto('Option1Page')
//   else if (item === '選項 2') goto('Option2Page')
//   else if (item === '選項 3') goto('Option3Page')
// }
</script>

<style scoped>
.top-bar {
  position: fixed;
  display: flex;
  top: 40px;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #000000fb;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  overflow: visible;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 30px; /* Logo 與下拉選單間距 */
  flex-shrink: 0;
}

.logo {
  font-size: 90px;
  color: #fff;
  text-decoration: none; /* 移除底線 */
}

.logo-img {
  display: block;
  width: auto;
  height: 140px;
}

.topbar-right-stack {
  display: flex;
  flex-direction: column; /* 讓其子元素垂直堆疊 */
  align-items: flex-end; /* 讓右側的 LoginMenu 和 CenterDropdown 對齊右邊 */
  justify-content: center; /* 讓整個堆疊區塊在 TopBar 內垂直置中 */
  height: 100%; /* 佔滿 TopBar 扣除 padding 後的垂直空間 */
  padding-bottom: 30px;
  gap: 5px; /* 給 LoginMenu 和 CenterDropdown 之間一點間距 */
  margin-right: 30px;
  flex-shrink: 1;
  min-width: 0;
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  white-space: nowrap;
  overflow: visible;
  flex-shrink: 1;
  min-width: 0;
}

.topbar-main {
  display: flex;
  align-items: center;
  padding-right: 150px;
  margin-top: 20px;
  flex-shrink: 1;
  min-width: 0;
}

.dropdown-below {
  position: absolute;
  top: 100%; /* 正下方 */
  right: 0; /* 右對齊 LoginMenu */
  margin-top: 4px; /* 距離 LoginMenu 一點縫隙 */
  /* z-index: 1001; 確保在 TopBar 之上 */
}
</style>
