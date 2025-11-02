<template>
  <div class="top-bar">
    <div class="topbar-left">
      <router-link to="/" class="logo"><Icon icon="logos:treehouse-icon" /> </router-link>

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

defineProps({ bannerOn: { type: Boolean, default: false } })
const onDropdownSelect = (item) => {
  if (item === '選項 1') goto('Option1Page')
  else if (item === '選項 2') goto('Option2Page')
  else if (item === '選項 3') goto('Option3Page')
}
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%; /* 背景滿版 */
  height: 100px;
  background-color: #000000fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* gap: 40px; */
  padding: 0 20px;
  /* box-sizing: border-box; */
  z-index: 1002;
  overflow: visible;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 30px; /* Logo 與下拉選單間距 */
}

.logo {
  font-size: 60px;
  /* font-weight: bold; */
  color: #fff;
  text-decoration: none; /* 移除底線 */
  /* margin-top: 20px; 調整上方距離
  margin-left: 20px; 調整左方距離 */
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  white-space: nowrap;
  overflow: visible;
  margin-right: 30px;
  padding-bottom: 40px;
  /* position: relative; */
  /* margin-top: 20px; 與 Logo 對齊 */
}

.dropdown-below {
  position: absolute;
  top: 100%; /* 正下方 */
  right: 0; /* 右對齊 LoginMenu */
  margin-top: 4px; /* 距離 LoginMenu 一點縫隙 */
  z-index: 1001; /* 確保在 TopBar 之上 */
}
</style>
