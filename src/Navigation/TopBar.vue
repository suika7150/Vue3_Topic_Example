<template>
  <div class="top-bar">
    <div class="topbar-left">
      <router-link to="/" class="logo"><Icon icon="logos:treehouse-icon" /> </router-link>
    </div>

    <div class="topbar-main">
      <!-- 主下拉選單 -->
      <CenterDropdown />
    </div>

    <!-- 登入選單 -->
    <div class="topbar-right">
      <LoginMenu :small="true" />
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
  z-index: 1002;
  overflow: visible;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 30px; /* Logo 與下拉選單間距 */
}

.logo {
  font-size: 90px;
  color: #fff;
  text-decoration: none; /* 移除底線 */
}

.topbar-main {
  display: flex;
  align-items: center;
  gap: 30px; /* Logo 與下拉選單間距 */
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  white-space: nowrap;
  overflow: visible;
  margin-right: 30px;
  align-items: center;
  padding-bottom: 100px;
}

.dropdown-below {
  position: absolute;
  top: 100%; /* 正下方 */
  right: 0; /* 右對齊 LoginMenu */
  margin-top: 4px; /* 距離 LoginMenu 一點縫隙 */
  z-index: 1001; /* 確保在 TopBar 之上 */
}
</style>
