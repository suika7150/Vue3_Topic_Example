<template>
  <div class="top-bar">
    <router-link to="/" class="logo"><Icon icon="logos:treehouse-icon" /> </router-link>

    <!-- 下拉選單 -->
    <div class="right">
      <LoginMenu :small="true" />
      <CenterDropdown class="dropdown-below" />
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
  top: 0;
  left: 0;
  width: 100%; /* 背景滿版 */
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100px;
  background-color: #000000fb;
  padding: 0;
  box-sizing: border-box;
}

.logo {
  font-size: 60px;
  font-weight: bold;
  color: #fff;
  text-decoration: none; /* 移除底線 */
  margin-top: 20px; /* 調整上方距離 */
  margin-left: 20px; /* 調整左方距離 */
}

.right {
  display: flex;
  align-items: center;
}

.dropdown-below {
  position: absolute;
  top: 100%; /* 正下方 */
  right: 0; /* 右對齊 LoginMenu */
  margin-top: 4px; /* 距離 LoginMenu 一點縫隙 */
  z-index: 1001; /* 確保在 TopBar 之上 */
}
</style>
