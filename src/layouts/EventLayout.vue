/* 活動頁面共用頁面版型 */

<template>
  <div class="campaign-shell" :class="[bgClass, { full }]">
    <div
      class="campaign-bg"
      :style="{
        backgroundImage: props.bgImage
          ? `url(${props.bgImage})`
          : 'radial-gradient(circle at top, #1a1a1a, #000)',
      }"
    ></div>

    <div class="campaign-content">
      <section class="campaign-hero">
        <slot name="hero" />
      </section>

      <section class="campaign-main">
        <slot />
      </section>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'dark',
  },
  full: {
    type: Boolean,
    default: false,
  },
  bgImage: {
    type: String,
    default: '',
  },
})

const bgClass = computed(() => `theme-${props.theme}`)
</script>
<style scoped>
.campaign-shell {
  min-height: 100vh;
  min-width: 100%;
  position: relative;
}

/* 背景*/
.campaign-bg {
  position: fixed;
  inset: 0;
  z-index: 0;

  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.campaign-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.15), transparent 40%),
    radial-gradient(circle at 80% 30%, rgba(255, 200, 0, 0.1), transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(255, 0, 100, 0.08), transparent 60%);
}

/* 內容 */
.campaign-content {
  position: relative;
  padding: 80px 20px;
  margin: 0 auto;
  z-index: 1;
}

/* 活動模式 */
.campaign-shell.full .campaign-content {
  max-width: none;
  width: 100%;
}

/* Hero 區 */
.campaign-hero {
  margin-bottom: 30px;
}
</style>
