<template>
  <div class="top-bar">
    <router-link to="/" class="logo"><Icon icon="logos:treehouse-icon" /> </router-link>

    <!-- 登入選單 -->
    <div class="right">
      <LoginMenu />
    </div>
  </div>
</template>

<script setup>
import LoginMenu from './LoginMenu.vue'
defineProps({ bannerOn: { type: Boolean, default: false } })
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
  align-items: center;
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
</style>
