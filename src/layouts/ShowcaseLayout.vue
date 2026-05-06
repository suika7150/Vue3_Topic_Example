<template>
  <div class="showcase">
    <!-- 背景 -->
    <div class="background" :style="{ backgroundImage: bg ? `url(${bg})` : '' }"></div>

    <!-- 遮罩 -->
    <div class="overlay"></div>

    <!-- 內容 -->
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  bg: String,
})
</script>

<style scoped>
.showcase {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 背景 */
.background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* 遮罩 */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1;
}

/* 內容 */
.content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}
</style>
