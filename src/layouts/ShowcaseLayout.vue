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
  overflow: hidden;
}

/* 背景層 */
.background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* 遮罩（控制可讀性） */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1;
}

/* 內容層 */
.content {
  position: relative;
  z-index: 2;
  padding: 80px 20px;
  color: white;
}
</style>
