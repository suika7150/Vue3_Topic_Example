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
  height: 100%;
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
  max-height: 100%;
  height: 140px;
}

.topbar-right-stack {
  display: flex;
  flex-direction: column; /* 讓其子元素垂直堆疊 */
  align-items: flex-end; /* 讓右側的 LoginMenu 和 CenterDropdown 對齊右邊 */
  justify-content: center; /* 讓整個堆疊區塊在 TopBar 內垂直置中 */
  height: 100%; /* 佔滿 TopBar 扣除 padding 後的垂直空間 */
  padding-bottom: 30px;
  gap: 0px; /* 給 LoginMenu 和 CenterDropdown 之間一點間距 */
  margin-right: 30px;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
}

.topbar-right {
  display: flex;
  justify-content: flex-end;
  /* white-space: nowrap; */
  overflow: hidden; /*確保超出容器寬度的內容被裁切 */
  flex-shrink: 1;
  min-width: 0;
  height: 100%;
}

.topbar-main {
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 150px;
  /* margin-top: 20px; */
  flex-shrink: 1;
  min-width: 0;
  overflow: visible;
}

.dropdown-below {
  position: absolute;
  top: 100%; /* 正下方 */
  right: 0; /* 右對齊 LoginMenu */
  margin-top: 4px; /* 距離 LoginMenu 一點縫隙 */
  /* z-index: 1001; 確保在 TopBar 之上 */
}
/* --- RWD 響應式設計：針對手機/小螢幕佈局 (小於 768px) --- */
@media (max-width: 768px) {
  /* 1. 調整整個 TopBar 容器 */
  .top-bar {
    flex-direction: column; /* 讓 Logo 區塊和 右側堆疊區塊 垂直排列 */
    height: 100%;
    margin-left: auto;
    top: 10px; /* 讓導覽列緊貼螢幕頂部 */
    padding: 35px 10px; /* 調整內邊距 */
    position: relative; /* 手機上可考慮使用 relative 或確保 top: 0 */

    /* 移除 fixed 定位，或確保 top: 0, 並且不會被其他元素遮擋 */
  }

  /* 2. 處理 Logo 尺寸和定位 */
  .topbar-left {
    width: 100%; /* 讓 Logo 區塊佔滿寬度 */
    justify-content: center; /* 讓 Logo 在手機上置中 */
  }

  .logo-img {
    height: 80px; /* **大幅縮小 Logo 尺寸**，防止溢出 */
  }

  /* 3. 處理右側堆疊區塊 (包含 LoginMenu 和 CenterDropdown) */
  .topbar-right-stack {
    width: 100%; /* 佔滿寬度，確保子元素有空間 */
    align-items: center; /* 讓子元素在堆疊區塊內置中 */
    padding-bottom: 0;
    margin-right: 0;
    flex-direction: column; /* 讓 LoginMenu 和 CenterDropdown 垂直堆疊 */
  }

  /* 4. 處理 LoginMenu 容器 */
  .topbar-right {
    /* 允許 LoginMenu 內部的文字換行 */
    white-space: normal;
    justify-content: center; /* 讓 LoginMenu 區塊置中 */
    width: 100%; /* 確保其有足夠寬度 */
  }

  .topbar-main {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 150px;
    margin-top: 20px;
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
  }
}
</style>
