<!-- src/components/TopBar.vue -->
<template>
  <header class="top-bar">
    <div class="logo">我的商城</div>
    <TopBarAdBanner :show="bannerOn" :width="'300px'" :interval="2000" />
    <div class="auth">
      <LoginMenu />
    </div>
  </header>
  <body>
    <SearchInput />
  </body>
</template>

<script setup>
import SearchInput from './SearchInput.vue'
import TopBarAdBanner from '@/navigation/TopBarAdBanner.vue'
import LoginMenu from './LoginMenu.vue'
defineProps({ bannerOn: { type: Boolean, default: false } })
</script>

<style scoped>
.top-bar {
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

.auth {
  display: flex;
  align-items: center;
}
</style>
