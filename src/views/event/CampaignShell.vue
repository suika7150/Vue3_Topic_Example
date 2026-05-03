<template>
  <div class="campaign-shell">
    <!-- 氛圍背景層 -->
    <div class="campaign-bg"></div>

    <!-- 上層內容 -->
    <div class="campaign-content">
      <!-- Hero 區 -->
      <section class="campaign-hero">
        <slot name="hero" />
      </section>

      <!-- 主內容 -->
      <section class="campaign-main">
        <slot name="default" />
      </section>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const bgClass = computed(() => {
  return `theme-${props.theme}`
})

defineProps({
  theme: {
    type: String,
    default: 'dark',
  },
})
</script>
<style scoped>
.campaign-shell {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 氛圍背景（很重要） */
.campaign-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, #1a1a1a, #000);
  z-index: 0;
}

/* 內容層 */
.campaign-content {
  position: relative;
  z-index: 1;
  padding: 40px 20px;
}

/* Hero 區 */
.campaign-hero {
  margin-bottom: 30px;
}
</style>
