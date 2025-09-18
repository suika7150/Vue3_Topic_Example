<!-- src/components/TopBar.vue -->
<template>
  <header class="top-bar">
    <div class="logo">我的商城</div>
    <TopBarAdBanner :show="bannerOn" :width="'300px'" :interval="2000" />

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
import TopBarAdBanner from '@/navigation/TopBarAdBanner.vue'
import LoginMenu from './LoginMenu.vue'
defineProps({ bannerOn: { type: Boolean, default: false } })
</script>

<style scoped>
.top-bar {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #40bffffb;
  color: #fff;
  padding: 0 20px;
  height: 100px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.right {
  display: flex;
  align-items: center;
}
</style>
