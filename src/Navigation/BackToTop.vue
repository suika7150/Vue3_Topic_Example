<template>
  <transition name="fade">
    <el-button v-if="showTop" type="primary" circle class="back-to-top" @click="scrollToTop">
      <el-icon><ArrowUp /></el-icon>
    </el-button>
  </transition>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

const showTop = ref(false)

const handleScroll = () => {
  showTop.value = window.scrollY > 200 // 超過 200px 顯示按鈕
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<style scoped>
.back-to-top {
  position: fixed;
  right: 30px; /* 右側距離 */
  bottom: 40px; /* 下方距離 */
  z-index: 9999;
  width: 50px;
  height: 50px;
  font-size: 20px;
  border: none;
  background-color: withite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
