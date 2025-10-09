<!-- src/components/TopBar.vue -->
<template>
  <header class="top-bar">
    <router-link to="/" class="logo"><Icon icon="logos:treehouse-icon" /> </router-link>

    <!-- 搜尋欄置中 -->
    <div class="center">
      <SearchInput />
    </div>

    <!-- 登入選單 -->
    <div class="right">
      <LoginMenu />
    </div>
  </header>
</template>

<script setup>
import SearchInput from './SearchInput.vue'
import LoginMenu from './LoginMenu.vue'
defineProps({ bannerOn: { type: Boolean, default: false } })
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* 填滿整個瀏覽器寬度 */
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  background-color: #000000fb;
  padding: 20px;
  box-sizing: border-box;
}

.logo {
  font-size: 60px;
  font-weight: bold;
  color: #fff;
  text-decoration: none; /* 移除底線 */
  margin-top: 20px; /* 調整上方距離 */
}

.right {
  display: flex;
  align-items: center;
}
</style>
