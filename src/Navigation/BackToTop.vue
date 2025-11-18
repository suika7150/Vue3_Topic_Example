<template>
  <div class="fixed-buttons-stack">
    <!-- 其他按鈕 -->
    <el-button
      type="primary"
      circle
      class="line"
      a
      href="http://line.me/ti/p/suika7150"
      target="_blank"
    >
      <el-icon><ChatLineRound /></el-icon>
    </el-button>
    <!-- <div class="line">
    <el-button a href="http://line.me/ti/p/suika7150" target="_blank">
      <el-icon><ChatDotRound /></el-icon>
    </el-button>
  </div> -->
    <el-button type="primary" circle class="share">
      <el-icon><Share /></el-icon>
    </el-button>

    <!-- 至頂按鈕 -->
    <transition name="fade">
      <el-button v-if="showTop" type="primary" circle class="back-to-top" @click="scrollToTop">
        <el-icon><Top /></el-icon>
      </el-button>
    </transition>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Top, Share, ChatDotRound, ChatLineRound } from '@element-plus/icons-vue'

const showTop = ref(false)

const handleScroll = () => {
  showTop.value = window.scrollY > 600 // 超過 200px 顯示按鈕
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
.line {
  position: fixed;
  right: 30px; /* 右側距離 */
  bottom: 220px; /* 下方距離 */
  font-size: 20px;
  color: #000;
  border: none;
  background-color: white;
}
.share {
  position: fixed;
  right: 30px; /* 右側距離 */
  bottom: 160px; /* 下方距離 */
  font-size: 20px;
  color: #000;
  border: none;
  background-color: white;
}

.back-to-top {
  position: fixed;
  right: 30px; /* 右側距離 */
  bottom: 100px; /* 下方距離 */
  font-size: 20px;
  color: #000;
  border: none;
  background-color: white;
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
